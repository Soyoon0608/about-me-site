# Card 5 · 계속 새로 쓰는 장치

이 저장소에는 기록과 과제 데이터를 바탕으로 숫자와 강점 후보 문장을 다시 계산하는 Card 5 장치를 포함하고 있습니다.

## 1. 목적

입력 파일을 기준으로 다음 결과를 자동으로 생성합니다.

- 출석 및 과제 제출 관련 숫자
- 능력별 기록 수
- 기록별 강점 후보 문장
- 사용자가 명시적으로 승인한 후보 문장

사이트에 반영하는 문장은 AI가 실행할 때마다 새롭게 생성하는 방식이 아니라, `approved_candidates.json`에 미리 승인된 문장만 사용하도록 구성했습니다.

따라서 같은 입력을 사용하면 같은 결과를 얻을 수 있습니다.

---

## 2. 폴더 구조

```text
about-me-site/
├─ input/
│  ├─ ritual_records.csv
│  ├─ assignments.csv
│  ├─ attendance.json
│  └─ approved_candidates.json
│
├─ output/
│  ├─ 기존 사이트 결과 파일
│  └─ card5/
│     ├─ numbers.json
│     ├─ candidates.json
│     ├─ approved_candidates.json
│     ├─ manifest.json
│     └─ result.sha256
│
├─ src/
│  └─ generate.py
│
├─ documents/
├─ index.html
├─ script.js
├─ style.css
└─ README.md
```

`output/card5/`는 Card 5 전용 결과 폴더입니다.

기존 `output/`에 있던 사이트 결과 파일을 덮어쓰지 않도록 별도의 하위 폴더를 사용합니다.

---

## 3. 입력 파일

### `ritual_records.csv`

날짜별 기록과 능력, 근거 문장을 저장합니다.

현재 장치가 사용하는 구조화된 기록은 총 30개입니다.

### `assignments.csv`

Studio 과제 T01~T11의 제출 상태와 관련 URL 및 첨부파일 정보를 저장합니다.

현재 총 11개 과제가 기록되어 있습니다.

### `attendance.json`

출석 관련 숫자를 저장합니다.

현재 기록:

- 전체 교육일: 27일
- 출석: 26일
- 결석: 0일
- 출석률: 96.3%

### `approved_candidates.json`

사이트에 반영할 문장을 사용자가 명시적으로 승인한 목록입니다.

현재 승인된 후보는 6개입니다.

---

## 4. 실행 방법

### 1단계 · 입력 확인

`input/` 폴더의 데이터를 확인하거나 필요한 경우 수정합니다.

### 2단계 · 장치 실행

프로젝트 최상위 폴더에서 다음 명령을 실행합니다.

Windows에서 Python 실행 파일의 경로가 등록되어 있지 않은 경우 실제 Python 경로를 직접 지정할 수 있습니다.

```cmd
"C:\Users\Administrator\AppData\Local\Programs\Python\Python313\python.exe" src\generate.py
```

Python이 정상적으로 PATH에 등록되어 있다면 다음 명령도 사용할 수 있습니다.

```cmd
python src\generate.py
```

### 3단계 · 결과 확인

실행 후 다음 폴더를 확인합니다.

```text
output/card5/
```

주요 결과 파일:

```text
numbers.json
candidates.json
approved_candidates.json
manifest.json
result.sha256
```

---

## 5. 결정성 검증

Card 5는 같은 입력에 대해 같은 결과를 생성하는지 확인하기 위해 동일한 명령을 두 번 실행했습니다.

### 1차 실행

```text
rituals=30
assignments=11
candidates=30
approved=6
```

결과 fingerprint:

```text
e3357908ecce3ea08f11792e1bbd8cf614b450215d2757ad2726495d3e5b5dc8
```

### 2차 실행

```text
rituals=30
assignments=11
candidates=30
approved=6
```

결과 fingerprint:

```text
e3357908ecce3ea08f11792e1bbd8cf614b450215d2757ad2726495d3e5b5dc8
```

두 실행의 fingerprint가 동일하므로, 현재 입력에 대한 결과가 동일하게 생성되는 것을 확인했습니다.

---

## 6. 사이트 반영 규칙

후보 문장은 두 단계로 구분합니다.

1. `candidates.json`
   - 입력 기록을 기준으로 생성된 후보 문장
2. `approved_candidates.json`
   - 사용자가 확인하고 승인한 문장
   - 사이트 반영 대상

사이트에는 승인된 후보만 반영합니다.

따라서 실행할 때마다 외부 AI 서비스에 요청하여 문장을 새롭게 생성하는 구조가 아닙니다.

---

## 7. AI 사용과 사용자 판단

### AI가 담당한 부분

- 기록을 구조화하는 과정에서 문장 정리 및 후보 구성에 활용
- 장치 구현 방향과 코드 작성에 활용

### 사용자가 직접 판단한 부분

- 어떤 기록을 입력 데이터로 사용할지 결정
- 어떤 후보 문장을 사이트에 반영할지 직접 검토하고 승인
- 최종 결과와 제출물을 확인

### 따르지 않은 AI 제안

AI가 제안한 내용을 그대로 자동 반영하지 않고, 최종 반영 여부는 사용자가 직접 결정했습니다.

---

## 8. 개인정보 및 비밀값

입력 데이터와 결과물에는 다른 사람의 이름, 연락처, 계정 비밀번호, API 키 등의 비밀값을 포함하지 않도록 확인했습니다.

외부 AI API를 실행하기 위한 API 키도 사용하지 않습니다.

---

## 9. 재현 확인

새로운 임시 폴더에 저장소를 복사한 뒤 다음 순서로 확인할 수 있습니다.

```text
1. 저장소 복사
2. Python 설치 및 실행 환경 확인
3. 프로젝트 최상위 폴더에서 src/generate.py 실행
4. output/card5/ 결과 확인
```

동일한 입력 파일을 사용하면 동일한 결과 fingerprint가 생성되는지 확인할 수 있습니다.

---

## 10. 제출 전 확인

- [x] `src/generate.py` 실행 성공
- [x] `output/card5/` 결과 생성 확인
- [x] 기존 `output/` 결과 파일 보존
- [x] 동일 입력으로 2회 실행
- [x] 2회 fingerprint 동일 확인
- [x] 과제 11개 데이터 확인
- [x] 승인 후보 6개 확인
- [x] 외부 AI API 호출 없음
- [x] 다른 사람의 개인정보 및 비밀값 미포함 확인
- [ ] 최종 제출용 문서 및 장치 ZIP 생성
- [ ] 제출 전 최종 URL 및 파일 접근 확인

---

## 11. 현재 검증 결과

```text
Card5 generation complete.

rituals=30
assignments=11
candidates=30
approved=6

deterministic=True

fingerprint:
e3357908ecce3ea08f11792e1bbd8cf614b450215d2757ad2726495d3e5b5dc8
```

이 결과는 2026-09-23 Windows 환경에서 동일한 입력을 두 번 실행하여 확인했습니다.
