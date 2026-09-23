from pathlib import Path
import csv
import json
import hashlib
import re


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "input"
OUTPUT = ROOT / "output"


ABILITY_TEMPLATES = {
    "끈기·문제해결력":
        "반복 확인과 원인 분석을 통해 문제를 끝까지 해결하려고 노력함.",

    "책임감":
        "맡은 일의 결과를 확인하고 필요한 부분을 끝까지 마무리함.",

    "자기주도성":
        "필요한 해결 방법을 스스로 찾아 적용함.",

    "공감·배려":
        "상대방의 이야기를 듣고 입장을 고려하며 소통함.",

    "책임감·리더십":
        "팀의 역할과 진행 상황을 조율하며 결과까지 책임짐."
}


def read_csv(filename):
    with open(
        INPUT / filename,
        encoding="utf-8-sig",
        newline=""
    ) as file:
        return list(csv.DictReader(file))


def load_json(filename):
    return json.loads(
        (INPUT / filename).read_text(encoding="utf-8")
    )


def clean(text):
    return re.sub(r"\s+", " ", str(text)).strip()


rituals = read_csv("ritual_records.csv")
assignments = read_csv("assignments.csv")
attendance = load_json("attendance.json")
approved = load_json("approved_candidates.json")["approved"]


rituals.sort(
    key=lambda x: (
        x["date"],
        x["ability"],
        x["evidence"]
    )
)

assignments.sort(
    key=lambda x: x["id"]
)

approved.sort(
    key=lambda x: (
        x["ability"],
        x["date"],
        x["sentence"]
    )
)


ability_counts = {}

for record in rituals:
    ability = record["ability"]

    ability_counts[ability] = (
        ability_counts.get(ability, 0) + 1
    )


numbers = {
    "attendance": attendance,

    "assignments": {
        "total": len(assignments),

        "completed": sum(
            1
            for assignment in assignments
            if assignment["status"] == "최종 확인 완료"
        )
    },

    "ritual_records": {
        "total": len(rituals),

        "dates": len(
            sorted(
                set(
                    record["date"]
                    for record in rituals
                )
            )
        ),

        "ability_record_counts":
            dict(sorted(ability_counts.items()))
    }
}


candidates = []

for record in rituals:

    ability = record["ability"]

    candidate = {
        "ability": ability,
        "date": record["date"],
        "evidence": clean(record["evidence"]),

        "candidate": clean(
            ABILITY_TEMPLATES.get(
                ability,
                "해당 기록에서 확인되는 행동과 결과를 바탕으로 강점을 표현함."
            )
        )
    }

    candidates.append(candidate)


candidates.sort(
    key=lambda x: (
        x["ability"],
        x["date"],
        x["evidence"]
    )
)


approved_output = {
    "approval_rule":
        "사이트 반영 대상은 approved_candidates.json에 명시적으로 승인된 문장만 사용.",

    "approved_count":
        len(approved),

    "items":
        approved
}


def write_json(filename, data):

    path = OUTPUT / filename

    path.write_text(
        json.dumps(
            data,
            ensure_ascii=False,
            indent=2
        ) + "\n",
        encoding="utf-8"
    )


write_json(
    "numbers.json",
    numbers
)

write_json(
    "candidates.json",
    {
        "count": len(candidates),
        "items": candidates
    }
)

write_json(
    "approved_candidates.json",
    approved_output
)


manifest = {
    "input_files": [
        "ritual_records.csv",
        "assignments.csv",
        "attendance.json",
        "approved_candidates.json"
    ],

    "output_files": [
        "numbers.json",
        "candidates.json",
        "approved_candidates.json"
    ],

    "deterministic": True,

    "approval_only_for_site": True
}


write_json(
    "manifest.json",
    manifest
)


hash_object = hashlib.sha256()

for path in sorted(
    OUTPUT.glob("*.json")
):

    hash_object.update(
        path.name.encode("utf-8")
    )

    hash_object.update(
        path.read_bytes()
    )


result_hash = hash_object.hexdigest()


(
    OUTPUT / "result.sha256"
).write_text(
    result_hash + "\n",
    encoding="utf-8"
)


print("Card5 generation complete.")
print(
    f"rituals={len(rituals)}, "
    f"assignments={len(assignments)}, "
    f"candidates={len(candidates)}, "
    f"approved={len(approved)}"
)

print(
    f"output fingerprint={result_hash}"
)
