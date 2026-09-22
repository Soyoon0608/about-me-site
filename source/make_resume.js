const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType,
} = require("docx");

const PAGE_WIDTH = 12240;
const PAGE_HEIGHT = 15840;

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2F5D4F" } },
  });
}

function label(text) {
  return new TableCell({
    width: { size: 2200, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, color: "auto", fill: "F0EFE7" },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })] })],
  });
}

function value(text) {
  return new TableCell({
    width: { size: 6800, type: WidthType.DXA },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
  });
}

function infoRow(l, v) {
  return new TableRow({ children: [label(l), value(v)] });
}

const infoTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  columnWidths: [2200, 6800],
  rows: [
    infoRow("이름", "김소윤"),
    infoRow("한 줄 소개", "이해되지 않는 문제를 그냥 넘기지 않고, 원인을 끝까지 확인하고 나서야 손을 떼는 사람"),
  ],
});

function careerHeaderRow() {
  const cells = ["기간", "기관 / 부서", "직무"].map(
    (t, i) =>
      new TableCell({
        width: { size: [2200, 3600, 3200][i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: "2F5D4F" },
        children: [
          new Paragraph({
            children: [new TextRun({ text: t, bold: true, size: 20, color: "FFFFFF" })],
          }),
        ],
      })
  );
  return new TableRow({ children: cells, tableHeader: true });
}

function careerRow(period, org, role) {
  const texts = [period, org, role];
  const widths = [2200, 3600, 3200];
  const cells = texts.map(
    (t, i) =>
      new TableCell({
        width: { size: widths[i], type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: t, size: 20 })] })],
      })
  );
  return new TableRow({ children: cells });
}

const careerTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  columnWidths: [2200, 3600, 3200],
  rows: [
    careerHeaderRow(),
    careerRow("2021.07.19 – 2021.12.17", "공공데이터인턴 · 정보지원팀", "데이터 수집 및 표준화 작업"),
    careerRow("2022.03.17 – 2022.07.15", "한국자산관리공사 · 가계지원팀", "민원응대 및 서민금융 지원"),
    careerRow("2024.10.04 – 2026.05.31", "디지털튜터 · 미래정보부", "학교 디지털 교육환경 운영 지원, IT 기기 관리"),
  ],
});

function bulletsFromList(items) {
  return items.map(
    (t) =>
      new Paragraph({
        text: t,
        bullet: { level: 0 },
        spacing: { after: 60 },
      })
  );
}

const doc = new Document({
  sections: [
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "이력서", bold: true, size: 44 })],
          spacing: { after: 200 },
        }),
        h1("기본 정보"),
        infoTable,

        h1("경력사항"),
        careerTable,

        h1("보유 역량"),
        ...bulletsFromList([
          "네트워크: 서브넷/라우팅 기본기, GNS3를 이용한 OSPF(NSSA 포함) 구성 및 트러블슈팅 실습",
          "데이터 처리: 공공데이터 수집 및 표준화 작업 경험",
          "AI 활용: 생성형 AI(Claude)를 활용한 실험 설계 및 결과 분석 — 「생성형 AI의 피싱 이메일 탐지 성능 분석 연구」 수행",
          "웹 제작: HTML/CSS/JavaScript로 개인 웹사이트 및 소개 페이지 제작",
          "민원응대: 한국자산관리공사 가계지원팀 근무 중 서민금융 관련 민원응대 및 상담 지원",
        ]),

        h1("자기 점검 — 최근 30일 리추얼 기록에서"),
        new Paragraph({
          text: "2026.08.11 – 2026.09.22 동안 매일 아침 목표를 적고 하루를 마무리하는 리추얼을 기록했다. 이 기간 동안 확인한 자신의 특성은 자기동기력, 문제해결력, 대인관계력, 자기조절력 네 가지이며, 각 특성을 보여주는 실제 장면은 자기소개서와 사이트(이야기 섹션)에 정리했다.",
          spacing: { after: 120 },
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("이력서.docx", buf);
  console.log("wrote 이력서.docx");
});
