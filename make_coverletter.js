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

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 21 })],
    spacing: { after: 160, line: 320 },
    alignment: "both",
  });
}

const doc = new Document({
  sections: [
    {
      properties: { page: { size: { width: PAGE_WIDTH, height: PAGE_HEIGHT }, margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      children: [
        new Paragraph({
          children: [new TextRun({ text: "자기소개서", bold: true, size: 44 })],
          spacing: { after: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "김소윤", size: 22, color: "565A52" })],
          spacing: { after: 200 },
        }),

        h1("1. 성장과정 — 확인하지 않고는 넘어가지 못하는 습관"),
        body(
          "저는 공공데이터인턴으로 정보지원팀에서 데이터 수집 및 표준화 작업을 하면서, 눈에 잘 띄지 않는 " +
          "데이터 오류를 그냥 지나치지 않고 직접 확인하고 수정하는 습관을 들였습니다. 처음에는 정해진 " +
          "절차대로 데이터를 옮기는 데 급급했지만, 값이 이상하다고 느껴질 때마다 원본을 다시 대조해보는 " +
          "과정을 반복하면서 '확인 없이 넘기지 않는 태도'가 업무 방식 자체로 자리잡았습니다. 이 태도는 " +
          "이후 학습과 프로젝트에서도 그대로 이어졌습니다."
        ),

        h1("2. 자기동기력 — 이해될 때까지 넘기지 않기"),
        body(
          "네트워크를 공부하면서 이해되지 않는 개념을 만난 적이 있습니다. 답만 외워서 넘어갈 수도 있었지만, " +
          "비슷한 개념끼리 비교해보며 왜 그런 답이 나오는지 스스로 확인하고 나서야 다음 내용으로 넘어갔습니다. " +
          "당장 필요한 만큼만 알고 넘어가는 것이 아니라, 제가 납득할 수 있을 때까지 스스로 동기를 유지하며 " +
          "학습하는 편입니다."
        ),

        h1("3. 문제해결력 — 라우팅이 안 될 때, R4를 찾기까지"),
        body(
          "GNS3로 OSPF NSSA 구성을 실습하던 중, 특정 구간의 라우팅이 되지 않는 상황을 만났습니다. 처음부터 " +
          "다시 구성하는 대신, 라우터 설정을 하나씩 짚어가며 어디서부터 문제가 시작되었는지 범위를 좁혀 " +
          "나갔습니다. 그 결과 R4 라우터에 빠져 있던 설정을 찾아냈고, 이를 채워 넣어 문제를 해결했습니다. " +
          "이 경험을 통해 문제가 생겼을 때 전체를 다시 만들기보다, 원인을 좁혀가며 정확한 지점을 찾는 " +
          "방식이 더 효율적이라는 것을 체득했습니다."
        ),

        h1("4. 대인관계력 — 의견이 갈렸을 때, 대화를 선택하다"),
        body(
          "해커톤에 참여했을 때 팀원과 구현 방향에 대한 의견이 갈린 적이 있습니다. 메신저로 각자의 " +
          "주장만 주고받기보다 직접 마주 앉아 이야기를 나누는 쪽을 선택했습니다. 서로의 의견을 들은 뒤 " +
          "각자의 강점에 맞게 역할을 다시 나누었고, 마감 전에 프로젝트를 완성할 수 있었습니다. 의견 차이를 " +
          "피하기보다 직접 마주하는 편이 결과적으로 더 빠른 해결책이라는 것을 확인한 경험이었습니다."
        ),

        h1("5. 자기조절력 — 코드가 사라진 날, GitHub 커밋을 뒤지다"),
        body(
          "Plan-Do-See 프로젝트 코드를 손보던 중 작업하던 내용 일부가 갑자기 사라진 적이 있습니다. " +
          "당황해서 처음부터 다시 쓰는 대신, GitHub 커밋 로그를 열어 이전 코드와 현재 코드를 한 줄씩 " +
          "비교했습니다. 감정적으로 대응하지 않고 절차대로 원인을 추적한 끝에 문제가 된 지점을 찾아 " +
          "복구할 수 있었습니다. 예상하지 못한 상황에서도 먼저 상태를 점검하고 절차를 밟는 편입니다."
        ),

        h1("6. 지원 동기 및 입사 후 포부"),
        body(
          "한국자산관리공사 가계지원팀에서 민원응대와 서민금융 지원 업무를 하며 사람을 직접 상대하는 " +
          "일의 무게를 배웠고, 디지털튜터로 학교 디지털 교육환경 운영과 IT 기기 관리를 지원하며 기술이 " +
          "실제로 사람들에게 닿는 과정을 가까이에서 지켜봤습니다. 최근에는 생성형 AI를 활용해 피싱 " +
          "이메일 탐지 성능을 분석하는 연구를 직접 설계하고 수행하며, 결과를 성급히 일반화하지 않고 " +
          "한계까지 함께 기록하는 연습을 하고 있습니다. 앞으로도 맡은 일의 원인과 결과를 끝까지 " +
          "확인하는 태도로, 문제를 정확히 짚고 사람과 함께 해결하는 사람이 되겠습니다."
        ),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("자기소개서.docx", buf);
  console.log("wrote 자기소개서.docx");
});
