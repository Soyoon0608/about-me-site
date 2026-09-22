/*
 * script.js
 * -----------------------------------------------------------
 * 이 사이트의 "숫자" 섹션은 output/numbers.json 을 그대로 읽어서 보여준다.
 * output/numbers.json 은 source/generate.py 가 input/*.json 으로부터
 * 계산해서 만든 파일이다. 즉 이 스크립트는 새로운 값을 계산하지 않는다 —
 * 계산은 generate.py 의 몫이고, 이 파일은 그 결과를 화면에 표시할 뿐이다.
 *
 * file:// 로 직접 열었을 때는 브라우저 보안 정책 때문에 fetch가
 * 막히는 경우가 있어서, 같은 시점에 generate.py 가 만든 값을 그대로
 * FALLBACK_NUMBERS 에 복사해두고 실패 시 이 값을 대신 쓴다.
 * (FALLBACK_NUMBERS 를 최신으로 유지하려면 generate.py 실행 후
 *  output/numbers.json 내용을 이 상수에 다시 붙여넣으면 된다.)
 */

const FALLBACK_NUMBERS = {
  "ritual": {
    "source": "리추얼 기록",
    "period_start": "2026-08-11",
    "period_end": "2026-09-22",
    "total_days": 30,
    "morning_done": 30,
    "morning_rate_percent": 100.0,
    "evening_done": 28,
    "evening_rate_percent": 93.3,
    "highlight_scenes": 4
  },
  "attendance": {
    "source": "내 출석 기록",
    "attended_days": 26,
    "total_days": 27,
    "rate_percent_input": 96.3,
    "rate_percent_computed": 96.3,
    "matches_input": true
  },
  "assignments": {
    "source": "내 제출 현황",
    "submitted": 8,
    "total": 13,
    "rate_percent": 61.5,
    "remaining": 5
  }
};

async function loadNumbers() {
  try {
    const res = await fetch("output/numbers.json", { cache: "no-store" });
    if (!res.ok) throw new Error("numbers.json fetch failed: " + res.status);
    return await res.json();
  } catch (err) {
    // file:// 로 열었거나 서버가 없는 경우: generate.py가 만든 값을 그대로 담은
    // FALLBACK_NUMBERS를 쓴다. 값 자체는 output/numbers.json과 동일하다.
    return FALLBACK_NUMBERS;
  }
}

function renderNumbersNote(numbers) {
  const el = document.getElementById("numbers-updated");
  if (!el) return;

  const r = numbers.ritual;
  const a = numbers.attendance;
  const s = numbers.assignments;

  el.textContent =
    `리추얼 ${r.period_start} ~ ${r.period_end} (${r.total_days}일) · ` +
    `아침 기록 ${r.morning_rate_percent}% · 마무리 기록 ${r.evening_rate_percent}% · ` +
    `출석 ${a.attended_days}/${a.total_days} (${a.rate_percent_computed}%) · ` +
    `제출 ${s.submitted}/${s.total} (${s.rate_percent}%) — source/generate.py로 계산한 값`;
}

function setActiveNavOnScroll() {
  const sections = document.querySelectorAll("main .section, .hero");
  const navLinks = document.querySelectorAll(".topbar-nav a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${id}`;
          link.style.color = isMatch ? "var(--accent-strong)" : "";
          link.style.borderColor = isMatch ? "var(--highlight)" : "transparent";
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((s) => {
    if (s.id) observer.observe(s);
  });
}

(async function init() {
  const numbers = await loadNumbers();
  renderNumbersNote(numbers);
  setActiveNavOnScroll();
})();
