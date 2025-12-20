# 문서화 규칙 (Documentation Rules)

> 이 문서는 `react-layered-dialog` 프로젝트의 문서 작성, 수정, 보강 시 따라야 할 규칙을 정의합니다.

---

## 1. 문서 구조 (Document Structure)

### 1.1 문서 디렉토리

```
docs/
├── index.md                    # 문서 인덱스 (목차)
├── getting-started/
│   ├── introduction.md         # 라이브러리 소개
│   ├── quick-start.md          # 빠른 시작 가이드
│   └── installation.md         # 설치 방법
├── guides/
│   ├── basic-usage.md          # 기본 사용법
│   ├── async-dialogs.md        # 비동기 다이얼로그
│   ├── state-management.md     # 상태 관리
│   ├── animations.md           # 애니메이션 처리
│   └── accessibility.md        # 접근성 가이드
├── api/
│   ├── dialog-store.md         # DialogStore API
│   ├── create-dialog-api.md    # createDialogApi
│   ├── use-dialog-controller.md # useDialogController
│   ├── dialogs-renderer.md     # DialogsRenderer
│   └── types.md                # 타입 정의
├── advanced/
│   ├── custom-registry.md      # 커스텀 레지스트리
│   ├── multiple-stores.md      # 다중 스토어
│   └── ssr.md                  # SSR 지원
└── contributing/
    ├── development.md          # 개발 환경 설정
    ├── commit-guide.md         # 커밋 가이드
    └── releasing.md            # 릴리즈 절차
```

### 1.2 문서 카테고리 정의

| 카테고리 | 목적 | 대상 독자 |
|---------|------|----------|
| `getting-started/` | 첫 사용자를 위한 진입점 | 라이브러리를 처음 접하는 개발자 |
| `guides/` | 기능별 심화 가이드 | 기본 사용법을 익힌 개발자 |
| `api/` | API 레퍼런스 | 상세 스펙이 필요한 개발자 |
| `advanced/` | 고급 사용 패턴 | 복잡한 요구사항이 있는 개발자 |
| `contributing/` | 기여자 가이드 | 라이브러리 개발에 참여하는 개발자 |

---

## 2. 문서 작성 규칙

### 2.1 언어 및 톤

- **언어**: 한글 우선 (PROJECT_RULES.md 준수)
- **톤**: 기술적이고 명확하게, 불필요한 수식어 최소화
- **코드 용어**: 영문 그대로 사용 (예: `DialogStore`, `useDialogController`)

### 2.2 문서 템플릿

모든 문서는 다음 구조를 따릅니다:

```markdown
# [문서 제목]

> 한 줄 요약 (문서의 목적)

---

## 개요
문서에서 다루는 내용 간략 설명

## 본문
### 섹션 1
### 섹션 2

## 예제
실제 코드 예시 (복사-붙여넣기 가능해야 함)

## 관련 문서
- [링크1](./path/to/doc1.md)
- [링크2](./path/to/doc2.md)
```

### 2.3 코드 블록 규칙

```tsx
// 파일 경로 주석으로 시작
// src/lib/dialogs.ts

import { DialogStore, createDialogApi } from 'react-layered-dialog';

// 핵심 코드만 포함, 불필요한 import 생략
```

- **언어 태그 필수**: `tsx`, `ts`, `bash` 등
- **파일 경로**: 주석으로 파일 위치 명시
- **복사 가능**: 예제 코드는 그대로 복사해서 동작해야 함

### 2.4 링크 규칙

- **내부 링크**: 상대 경로 사용 (`./api/dialog-store.md`)
- **외부 링크**: 전체 URL 사용
- **앵커**: 소문자, 하이픈으로 연결 (`#basic-usage`)

---

## 3. 문서 유형별 규칙

### 3.1 API Reference 문서

```markdown
# [API 이름]

> 한 줄 설명

## 시그니처
\`\`\`ts
function apiName(param1: Type1, param2?: Type2): ReturnType
\`\`\`

## 매개변수
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| param1 | `Type1` | ✅ | 설명 |
| param2 | `Type2` | ❌ | 설명 |

## 반환값
`ReturnType` - 설명

## 예제
\`\`\`tsx
const result = apiName('value');
\`\`\`

## 주의사항
- 주의할 점 1
- 주의할 점 2
```

### 3.2 Guide 문서

```markdown
# [가이드 제목]

> 이 가이드에서 배울 내용

## 사전 요구사항
- 요구사항 1
- 요구사항 2

## 단계별 진행
### 1단계: [제목]
### 2단계: [제목]

## 완성 코드
전체 코드 예시

## 다음 단계
- [관련 가이드 1](./link.md)
```

---

## 4. 문서 업데이트 프로세스

### 4.1 문서 수정 시

1. 수정 대상 문서 확인
2. `docs/index.md` 인덱스 일관성 확인
3. 관련 문서 링크 업데이트
4. 코드 예제 동작 확인

### 4.2 새 문서 추가 시

1. 카테고리 결정 (getting-started / guides / api / advanced)
2. 템플릿에 따라 작성
3. `docs/index.md`에 항목 추가
4. 관련 문서에 상호 링크 추가

### 4.3 문서 삭제 시

1. 해당 문서를 참조하는 모든 링크 확인
2. 대체 문서로 리다이렉트 또는 링크 제거
3. `docs/index.md`에서 항목 제거

---

## 5. 품질 체크리스트

문서 작성/수정 후 다음 항목을 확인합니다:

- [ ] 한글 우선 원칙 준수
- [ ] 코드 예제가 실제로 동작하는지 확인
- [ ] 모든 내부 링크가 유효한지 확인
- [ ] API 변경 시 관련 문서 동기화
- [ ] 불필요한 중복 내용 제거

---

## 6. 버전 관리

- **문서 버전**: 라이브러리 버전과 동기화
- **Breaking Changes**: API 변경 시 문서 최우선 업데이트
- **Changelog**: 주요 문서 변경 사항 기록
