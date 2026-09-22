const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType,
} = require("docx");

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

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21 })],
    spacing: { after: 160, line: 320 },
    alignment: AlignmentType.BOTH,
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

function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2250, type: WidthType.DXA },
    shading: opts.header
      ? { type: ShadingType.CLEAR, color: "auto", fill: "2F5D4F" }
      : undefined,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: !!opts.header,
            color: opts.header ? "FFFFFF" : "24262B",
            size: 20,
          }),
        ],
      }),
    ],
  });
}

const resultTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  columnWidths: [3000, 3000, 3000],
  rows: [
    new TableRow({
      tableHeader: true,
      children: [cell("구분", { header: true }), cell("실제 피싱 (30건)", { header: true }), cell("실제 정상 (10건)", { header: true })],
    }),
    new TableRow({
      children: [cell("Claude 판정: 피싱"), cell("30건 (전건 일치)"), cell("0건")],
    }),
    new TableRow({
      children: [cell("Claude 판정: 정상"), cell("0건"), cell("10건 (전건 일치)")],
    }),
  ],
});

const metricTable = new Table({
  width: { size: 9000, type: WidthType.DXA },
  columnWidths: [3000, 3000, 3000],
  rows: [
    new TableRow({
      tableHeader: true,
      children: [cell("정확도 (Accuracy)", { header: true }), cell("FPR (오탐률)", { header: true }), cell("FNR (미탐률)", { header: true })],
    }),
    new TableRow({
      children: [cell("100%"), cell("0%"), cell("0%")],
    }),
  ],
});

const doc = new Document({
  sections: [
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "생성형 AI의 피싱 이메일 탐지 성능 분석 연구", bold: true, size: 34 })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "— 긴급성, 정보 요구 및 링크 접속 유도 특성을 중심으로 —", size: 22, color: "565A52" })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "김소윤 · 과제 10 — AI와 함께 쓰는 첫 논문", size: 20, color: "565A52" })],
          spacing: { after: 240 },
        }),

        h1("1. 서론"),
        body(
          "피싱 이메일은 흔히 긴급성 강조, 정보 요구, 링크 접속 유도라는 세 가지 특성을 이용해 사용자를 " +
          "속인다. 최근 생성형 AI가 이메일 내용을 요약·분류하는 데 널리 쓰이면서, AI가 이런 특성을 가진 " +
          "이메일을 실제로 얼마나 잘 구별해내는지 확인할 필요가 있다고 판단했다. 이 연구는 생성형 AI " +
          "(Claude)가 피싱 이메일과 정상 이메일을 구별할 수 있는지, 이 실험 조건 안에서 그 성능이 " +
          "어느 정도인지 확인하는 것을 목적으로 한다."
        ),

        h1("2. 연구 방법"),
        h2("2.1 데이터 구성"),
        body(
          "영어로 작성된 이메일 총 40건을 연구자가 직접 구성했다. 이 중 30건은 긴급성 강조형, " +
          "정보요청형, 링크클릭유도형 등 피싱 이메일에서 흔히 나타나는 특성을 포함한 피싱 이메일이며, " +
          "나머지 10건은 해당 특성이 없는 정상 이메일이다."
        ),
        h2("2.2 분류 절차"),
        body(
          "40건의 이메일을 하나씩 Claude에게 제시하고, 각 이메일이 피싱인지 정상인지 이분법으로 " +
          "판정하도록 했다. Claude의 판정 결과를 실제 라벨(피싱/정상)과 대조해 정확도, FPR(정상을 " +
          "피싱으로 잘못 판정한 비율), FNR(피싱을 정상으로 잘못 판정한 비율)을 계산했다."
        ),

        h1("3. 결과"),
        resultTable,
        new Paragraph({ text: "", spacing: { after: 200 } }),
        metricTable,
        new Paragraph({ text: "", spacing: { after: 120 } }),
        body(
          "이 실험 조건에서 Claude는 피싱 이메일 30건을 모두 피싱으로, 정상 이메일 10건을 모두 " +
          "정상으로 판정했다. 그 결과 정확도 100%, FPR 0%, FNR 0%를 기록했다."
        ),

        h1("4. 한계"),
        ...bullets([
          "표본 수가 40건으로 제한적이며, 통계적으로 일반화하기에는 규모가 작다.",
          "생성형 AI 모델을 Claude 한 종류만 사용했으며, 다른 모델과의 비교는 이루어지지 않았다.",
          "영어로 작성된 이메일만을 대상으로 했으며, 한국어 등 다른 언어의 피싱 이메일에는 적용되지 않았다.",
          "실제 유통되는 이메일이 아니라 연구자가 직접 구성한 이메일을 사용했기 때문에, 실제 환경의 " +
          "다양성과 노이즈를 충분히 반영하지 못했을 수 있다.",
        ]),

        h1("5. 결론"),
        body(
          "제한된 실험 조건 안에서 Claude는 이 연구에서 구성한 피싱 이메일의 특성(긴급성 강조, " +
          "정보 요구, 링크 접속 유도)을 사람이 만든 정상 이메일과 명확히 구별했다. 다만 표본 수, " +
          "모델 종류, 언어, 실험 환경의 한계로 인해 이 결과를 일반적인 피싱 탐지 성능으로 확대 " +
          "해석하는 것은 신중해야 한다. 후속 연구에서는 표본을 늘리고, 실제 유통되는 이메일과 " +
          "다양한 언어·모델을 포함해 검증할 필요가 있다."
        ),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("10번_대표작_생성형AI피싱이메일탐지성능분석.docx", buf);
  console.log("wrote paper docx");
});
