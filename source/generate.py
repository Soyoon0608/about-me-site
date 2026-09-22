#!/usr/bin/env python3
"""
generate.py
-----------
"계속 새로 쓰는 장치"의 본체.

input/ritual.json, input/attendance.json, input/assignments.json 을 읽어서
output/numbers.json 과 output/paragraph_candidates.md 를 새로 만든다.

- 이 스크립트는 순수 함수처럼 동작한다: 같은 input/ 이면 항상 같은 output/ 이 나온다.
  (실행 시각, 난수, 외부 API 호출을 전혀 사용하지 않는다.)
- 리추얼 기록이 하루하루 쌓일 때마다 input/ritual.json 을 갱신하고
  이 스크립트를 다시 실행하면, 사이트에 쓸 숫자와 문단 후보가 자동으로 새로 만들어진다.

사용법:
    python3 source/generate.py
    (프로젝트 루트에서 실행. input/ 을 읽어 output/ 에 덮어쓴다.)
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_DIR = os.path.join(BASE_DIR, "input")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

STRENGTH_LABELS = {
    "2026-08-20": "자기동기력",
    "2026-08-28": "문제해결력",
    "2026-09-11": "대인관계력",
    "2026-09-16": "자기조절력",
}

SCENE_TITLES = {
    "2026-08-20": "이해될 때까지 넘기지 않기",
    "2026-08-28": "라우팅이 안 될 때, R4를 찾기까지",
    "2026-09-11": "의견이 갈렸을 때, 대화를 선택하다",
    "2026-09-16": "코드가 사라진 날, GitHub 커밋을 뒤지다",
}


def load_json(name):
    path = os.path.join(INPUT_DIR, name)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def round1(x):
    # 파이썬 round()의 banker's rounding을 피하고
    # 사람이 기대하는 방식(0.05 -> 0.1)으로 반올림한다.
    return int(x * 10 + 0.5) / 10


def compute_numbers(ritual, attendance, assignments):
    records = ritual["records"]
    total_days = len(records)
    morning_done = sum(1 for r in records if r["morning_done"])
    evening_done = sum(
        1 for r in records if r["evening_done"] and r["evening_note"].strip()
    )
    highlight_count = sum(1 for r in records if r.get("highlight"))

    ritual_numbers = {
        "source": ritual["source"],
        "period_start": ritual["period_start"],
        "period_end": ritual["period_end"],
        "total_days": total_days,
        "morning_done": morning_done,
        "morning_rate_percent": round1(morning_done / total_days * 100),
        "evening_done": evening_done,
        "evening_rate_percent": round1(evening_done / total_days * 100),
        "highlight_scenes": highlight_count,
    }

    computed_attendance_rate = round1(
        attendance["attended_days"] / attendance["total_days"] * 100
    )
    attendance_numbers = {
        "source": attendance["source"],
        "attended_days": attendance["attended_days"],
        "total_days": attendance["total_days"],
        "rate_percent_input": attendance["rate_percent"],
        "rate_percent_computed": computed_attendance_rate,
        # 입력값과 재계산값이 다르면 데이터 자체를 다시 확인해야 한다는 신호.
        "matches_input": abs(computed_attendance_rate - attendance["rate_percent"]) < 0.05,
    }

    submitted = assignments["submitted"]
    total = assignments["total"]
    assignment_numbers = {
        "source": assignments["source"],
        "submitted": submitted,
        "total": total,
        "rate_percent": round1(submitted / total * 100),
        "remaining": total - submitted,
    }

    return {
        "ritual": ritual_numbers,
        "attendance": attendance_numbers,
        "assignments": assignment_numbers,
    }


def build_paragraph_candidates(ritual):
    records = [r for r in ritual["records"] if r.get("highlight")]
    # 날짜순 정렬 (input 순서에 의존하지 않도록)
    records.sort(key=lambda r: r["date"])

    lines = []
    lines.append("# 자기소개 문단 후보")
    lines.append("")
    lines.append(
        "> 이 파일은 `source/generate.py`가 `input/ritual.json`의 실제 기록에서"
        " 자동으로 뽑아낸 문단 후보다. 사람이 직접 쓴 문장이 아니라, 리추얼 기록을"
        " 재료로 매번 다시 만들어지는 초안이므로 최종 자기소개서에 쓸 때는 반드시"
        " 다시 다듬어야 한다."
    )
    lines.append("")

    for r in records:
        date = r["date"]
        strength = STRENGTH_LABELS.get(date, "")
        title = SCENE_TITLES.get(date, "")
        scene = r["evening_note"] or r["morning_note"]

        lines.append(f"## {title} ({date}) — {strength}")
        lines.append("")
        lines.append("**후보 문단:**")
        lines.append("")
        lines.append(f"> {scene}")
        lines.append("")
        lines.append(f"이 경험은 {strength}을(를) 보여준다. (출처: 리추얼 기록, {date})")
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    ritual = load_json("ritual.json")
    attendance = load_json("attendance.json")
    assignments = load_json("assignments.json")

    numbers = compute_numbers(ritual, attendance, assignments)
    numbers_path = os.path.join(OUTPUT_DIR, "numbers.json")
    with open(numbers_path, "w", encoding="utf-8") as f:
        json.dump(numbers, f, ensure_ascii=False, indent=2)
        f.write("\n")

    paragraphs = build_paragraph_candidates(ritual)
    paragraphs_path = os.path.join(OUTPUT_DIR, "paragraph_candidates.md")
    with open(paragraphs_path, "w", encoding="utf-8") as f:
        f.write(paragraphs)

    print(f"[generate.py] wrote {numbers_path}")
    print(f"[generate.py] wrote {paragraphs_path}")

    if not numbers["attendance"]["matches_input"]:
        print(
            "[generate.py] 경고: attendance.json의 rate_percent 값이 "
            "attended_days/total_days 계산값과 다릅니다. input을 확인하세요.",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
