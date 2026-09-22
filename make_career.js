const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = require("docx");

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2F5D4F" } },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, color: "1F4438" })],
    spacing: { before: 200, after: 100 },
  });
}

function meta(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 19, color: "565A52", italics: true })],
    spacing: { after: 120 },
  });
}

function bullets(items) {
  return items.map(
    (t) =>
      new Paragraph({
        text: t,
        bullet: { level: 0 },
        spacing: { after: 70 },
      })
  );
}

const doc = new Document({
  sections: [
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "경력기술서", bold: true, size: 44 })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "김소윤", size: 22, color: "565A52" })],
          spacing: { after: 200 },
        }),

        h1("1. 공공데이터인턴 — 정보지원팀"),
        meta("2021.07.19 – 2021.12.17"),
        h2("담당 업무"),
        ...bullets([
          "공공데이터 수집 및 표준화 작업",
          "수집된 데이터의 형식·값 오류 점검 및 수정",
        ]),
        h2("업무 방식 및 배운 점"),
        new Paragraph({
          children: [new TextRun({ text:
            "정해진 절차에 따라 데이터를 옮기는 업무였지만, 값이 이상하다고 느껴질 때 그냥 넘기지 않고 " +
            "원본과 다시 대조하는 방식으로 일했습니다. 이 과정에서 '확인 없이 넘기지 않는 태도'가 " +
            "업무 습관으로 자리잡았고, 이후 학습·프로젝트에서도 문제 원인을 끝까지 확인하는 방식으로 " +
            "이어졌습니다.", size: 20 })],
          spacing: { after: 160, line: 300 },
        }),

        h1("2. 한국자산관리공사 — 가계지원팀"),
        meta("2022.03.17 – 2022.07.15"),
        h2("담당 업무"),
        ...bullets([
          "민원응대 및 상담 지원",
          "서민금융 관련 지원 업무 보조",
        ]),
        h2("업무 방식 및 배운 점"),
        new Paragraph({
          children: [new TextRun({ text:
            "다양한 상황의 민원인을 직접 상대하면서, 정해진 답변보다 상대방의 상황을 정확히 파악하는 것이 " +
            "먼저라는 점을 배웠습니다. 사람을 직접 상대하는 업무의 무게를 실감한 경험이었고, 이후 " +
            "팀 프로젝트에서 의견 차이를 조율할 때도 상대의 입장을 먼저 확인하는 태도로 이어졌습니다.",
            size: 20 })],
          spacing: { after: 160, line: 300 },
        }),

        h1("3. 디지털튜터 — 미래정보부"),
        meta("2024.10.04 – 2026.05.31"),
        h2("담당 업무"),
        ...bullets([
          "학교 디지털 교육환경 운영 지원",
          "IT 기기 관리 및 점검",
        ]),
        h2("업무 방식 및 배운 점"),
        new Paragraph({
          children: [new TextRun({ text:
            "기술이 실제로 학생과 교사에게 닿는 접점에서 일하면서, 문제가 생겼을 때 임기응변으로 " +
            "넘기기보다 원인을 확인하고 재발하지 않도록 정리해두는 방식으로 일했습니다. 이 시기의 " +
            "경험은 이후 네트워크(OSPF/GNS3) 실습이나 개발 과정에서 문제를 만났을 때도 같은 방식으로 " +
            "접근하는 데 영향을 주었습니다.", size: 20 })],
          spacing: { after: 160, line: 300 },
        }),

        h1("4. 개인 프로젝트 — AI와 함께 쓰는 첫 논문"),
        meta("2026 (진행)"),
        h2("담당 업무"),
        ...bullets([
          "연구 주제 및 가설 설계: 피싱 수법(긴급성 강조형 / 정보요청형 / 링크클릭유도형)에 따라 " +
          "AI 판별 정확도가 달라지는지 확인",
          "실험 설계: 피싱 이메일 30건, 정상 이메일 10건(총 40건)을 대상으로 Claude의 분류 결과 측정",
          "결과 분석: 정확도, FPR(오탐률), FNR(미탐률) 계산 및 한계 정리",
        ]),
        h2("업무 방식 및 배운 점"),
        new Paragraph({
          children: [new TextRun({ text:
            "논문을 써본 경험이 없는 상태에서 주제를 정하는 것부터 어려움을 느꼈지만, 처음 떠올린 " +
            "주제를 그대로 밀어붙이지 않고 더 흥미롭고 검증 가능한 방향으로 가설을 다듬었습니다. " +
            "결과가 좋게 나왔을 때도(정확도 100%) 표본 수·언어·실험 환경의 한계를 함께 명시해 " +
            "성급한 일반화를 피하려 했습니다.", size: 20 })],
          spacing: { after: 160, line: 300 },
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("경력기술서.docx", buf);
  console.log("wrote 경력기술서.docx");
});
