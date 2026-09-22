# A · 나를 소개하는 사이트, 그리고 계속 새로 쓰는 장치

김소윤 — 최종 제출

---

## 1. 실행 방법 (3단계)

1. 이 ZIP을 원하는 폴더에 압축 해제한다.
2. `index.html`을 더블클릭해 브라우저로 연다. (별도 서버 설치 없이 바로 열림)
3. 상단 메뉴(이야기 / 숫자 / 대표작 / 문서)를 눌러 각 섹션으로 이동하고, `문서` 섹션에서 이력서·자기소개서·경력기술서·대표작 문서를 내려받는다.

> 브라우저 보안 정책상 `file://`로 직접 열면 `output/numbers.json`을 못 불러올 수 있는데, 이 경우 `script.js`에 넣어둔 동일한 값(FALLBACK_NUMBERS)이 대신 표시되므로 화면에는 영향이 없다. 로컬 서버로 열고 싶다면 이 폴더에서 `python3 -m http.server`를 실행한 뒤 `http://localhost:8000`으로 접속해도 된다.

---

## 2. 새 임시 폴더에서 `generate.py` 재현하는 방법

이 프로젝트의 숫자와 문단 후보는 사람이 손으로 쓴 게 아니라 `source/generate.py`가 `input/*.json`을 읽어 `output/`에 다시 만들어내는 값이다. 아래 순서로 누구나 재현할 수 있다.

```bash
# 1) 새 임시 폴더를 만들고 제출 폴더의 input/, source/ 만 복사한다
mkdir /tmp/repro_test
cp -r input source /tmp/repro_test/
cd /tmp/repro_test

# 2) 스크립트를 실행한다 (표준 라이브러리만 사용, 별도 설치 불필요)
python3 source/generate.py

# 3) output/ 폴더가 새로 생기고, 그 안의 numbers.json / paragraph_candidates.md 가
#    제출 폴더의 output/ 내용과 동일한지 확인한다
diff output/numbers.json ../<제출폴더>/output/numbers.json
diff output/paragraph_candidates.md ../<제출폴더>/output/paragraph_candidates.md
```

`source/generate.py`는 `input/`을 상대경로가 아니라 스크립트 파일 위치 기준으로 찾기 때문에, 프로젝트 루트 어디서 실행해도 동작한다.

---

## 3. 같은 입력이면 같은 결과가 나오는지 확인하는 방법

`generate.py`는 현재 시각, 난수, 외부 API 호출을 전혀 쓰지 않는 순수 계산 스크립트다. 즉 **같은 `input/`이면 언제 몇 번을 실행하든 항상 같은 `output/`이 나온다.** 아래처럼 두 번 실행해서 직접 확인할 수 있다.

```bash
python3 source/generate.py
cp output/numbers.json /tmp/run1_numbers.json
cp output/paragraph_candidates.md /tmp/run1_paragraphs.md

python3 source/generate.py
diff /tmp/run1_numbers.json output/numbers.json          # 출력 없음 = 동일
diff /tmp/run1_paragraphs.md output/paragraph_candidates.md  # 출력 없음 = 동일
```

이 제출본을 만들 때도 위 방법으로 직접 두 번 실행해 결과가 완전히 같다는 것을 확인했다.

---

## 4. 데이터 출처

| 데이터 | 출처(표시된 그대로) | 파일 |
|---|---|---|
| 30일간(2026-08-11~2026-09-22)의 아침/마무리 기록, 4개 하이라이트 장면 | 리추얼 기록 | `input/ritual.json` |
| 출석 26/27일, 96.3% | 내 출석 기록 | `input/attendance.json` |
| 과제 제출 8/13 | 내 제출 현황 | `input/assignments.json` |

사이트의 `숫자` 섹션과 `output/numbers.json`, `output/paragraph_candidates.md`에 표시되는 모든 수치·인용에는 위 세 출처 중 하나가 함께 표시된다.

---

## 5. AI에게 맡긴 작업

- `input/ritual.json`의 하이라이트가 아닌 나머지 26일치 아침/마무리 기록 문구(짧은 일반 메모) 작성 — 실제 기록이 파일 형태로 없어, 4개 하이라이트 장면과 어울리는 형식의 짧은 더미 문구로 채움
- `source/generate.py`, `script.js` 등 코드 작성
- 사이트 디자인(색상·타이포그래피·레이아웃) 및 `index.html` / `style.css` 마크업
- 이력서·경력기술서·자기소개서·대표작 문서(.docx)의 문장 초안 작성
- README 문서 구조 및 초안 작성

## 6. 내가 결정한 내용 (사용자가 직접 지정한 사실)

- 리추얼 기록의 실제 기간(2026-08-11~2026-09-22), 총 30일, 아침 기록 30일, 마무리 기록 28일이라는 숫자
- 출석 26/27일(96.3%), 제출 8/13이라는 숫자와 각각의 출처 표기("내 출석 기록", "내 제출 현황")
- 4개의 실제 장면(날짜, 상황, 결과, 연결되는 강점: 자기동기력/문제해결력/대인관계력/자기조절력)
- 대표작(10번 논문)의 실험 구성(피싱 30건+정상 10건), 결과(정확도 100%, FPR 0%, FNR 0%), 한계 항목
- 13번 앱은 아직 만들지 않았다는 사실과, "12번 A 과제 완료 후 제작 예정"이라는 자리만 두라는 지시
- 첫 화면의 이름(김소윤)과 한 줄 소개가 "…한 사람"으로 끝나야 한다는 형식
- 제출 파일 목록과 최종 ZIP 파일명(`A_final_submission.zip`)

## 7. 따르지 않은 AI 제안

- 처음에는 사이트가 `output/numbers.json`을 `fetch`로만 불러오게 하려 했으나, `file://`로 직접 열면 fetch가 막히는 경우가 있어 실패 시 대비용으로 `script.js`에 같은 값을 하드코딩해두는 방식을 함께 넣었다. (fetch만 쓰는 안은 채택하지 않음)
- 13번 대표작 앱을 간단하게라도 미리 만들어두는 방향도 고려했으나, 지시에 따라 실제 앱은 만들지 않고 "제작 예정" 자리만 남겼다.
- 학력 사항은 실제로 전달받은 정보가 없어, 사실이 아닌 내용을 지어내지 않기 위해 이력서에서 학력 섹션 자체를 넣지 않았다.

## 8. 개인정보 확인

- 이 제출물 어디에도 다른 사람의 실명, 연락처, 이메일 주소를 넣지 않았다. (본인 이름 "김소윤"만 사용)
- 비밀번호, API 키, 토큰, 계좌번호, 주민등록번호 등 민감정보를 포함하지 않았다.
- 모든 데이터 파일(`input/*.json`, `output/*`)에는 날짜·집계 수치·요약 문장만 들어있으며, 개인 식별 정보나 인증정보는 포함되어 있지 않다.

---

## 파일 구성

```
index.html                                   사이트 첫 화면
style.css                                    사이트 스타일
script.js                                    사이트 스크립트 (숫자 섹션 표시)
README.md                                    이 문서
source/generate.py                           input/ → output/ 을 만드는 재현 가능한 스크립트
source/make_resume.js                        이력서.docx 생성 스크립트 (참고용)
source/make_coverletter.js                   자기소개서.docx 생성 스크립트 (참고용)
source/make_career.js                        경력기술서.docx 생성 스크립트 (참고용)
source/make_paper.js                         대표작 문서 생성 스크립트 (참고용)
input/ritual.json                            리추얼 기록 원본 데이터
input/attendance.json                        출석 기록 원본 데이터
input/assignments.json                       제출 현황 원본 데이터
output/numbers.json                          generate.py가 계산한 숫자
output/paragraph_candidates.md               generate.py가 뽑은 자기소개 문단 후보
이력서.docx
자기소개서.docx
경력기술서.docx
10번_대표작_생성형AI피싱이메일탐지성능분석.docx
```
