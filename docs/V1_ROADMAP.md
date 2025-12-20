# V1.0 릴리즈 로드맵

> DX 분석 결과를 기반으로 v1.0 릴리즈를 위한 작업을 기능별로 분류한 체크리스트입니다.

---

## 마일스톤 개요

| 마일스톤 | 설명 | 예상 작업량 |
|---------|------|------------|
| **M1: API 정비** | 사용성 개선 및 Breaking Changes | 중 |
| **M2: 문서화** | README 및 가이드 문서 작성 | 대 |
| **M3: 테스트 강화** | 테스트 커버리지 확대 | 소 |
| **M4: 품질 개선** | 버그 수정 및 코드 정리 | 소 |

---

## M1: API 정비

### ~~M1-1: `close()` 자동 unmount 옵션 추가~~ (취소) ⚪
> 사유: 현재의 명시적 분리 구조가 Headless 철학에 더 부합하며, 아직 이것이 "문제"라고 판단하기 이름. 사용자가 unmount 시점을 100% 제어할 수 있는 현재 구조를 유지함.

**대체 작업**:
- M2-4 가이드 문서 내 "애니메이션과 함께 다이얼로그 닫기" 섹션 추가

---

### M1-2: `resolve` 페이로드 확장 🟢
> 현재 `{ ok: boolean }` 만 전달 가능

**작업 내용**:
- [x] `DialogAsyncResolvePayload<T>` 제네릭 타입으로 변경
- [x] `resolve({ ok, data })` 형태 지원
- [x] 타입 추론 테스트
- [x] 문서 예시 추가

**파일**: `types.ts`, `store.ts`

---

### M1-3: 레지스트리 키 기반 ID 생성 🟢
> 현재 `dialog-0`, `dialog-1` 형태로 디버깅 어려움

**작업 내용**:
- [x] `createDialogApi`에서 레지스트리 키를 ID prefix로 사용
- [x] ID 형식: `confirm-0`, `alert-1`
- [x] 기존 동작과 호환성 유지

**파일**: `registry.ts`

---

### M1-4: 네이밍 개선 (`getProps`, `getProp`) �
> `getStateFields` 보다 직관적인 네이밍 필요

**작업 내용**:
- [x] `getStateFields` -> `getProps` (별칭 유지)
- [x] `getStateField` -> `getProp`
- [x] 내부 및 예제 코드 업데이트

**파일**: `renderer.tsx`, `types.ts`

---

### M1-5: `example` 앱 정리 🟢
> `dialog`와 `renewalDialog` 이중 export 정리

**작업 내용**:
- [x] `dialogs.ts`에서 단일 export(`dialog`)로 통일
- [x] 예제 코드 일관성 확보 (M1-4 반영)

**파일**: `example/src/lib/dialogs.ts`

---

## M2: 문서화

### M2-1: README 구조 개편 🟢
> Architecture Overview 부재, Quick Start 복잡

**작업 내용**:
- [x] "Architecture Overview" 섹션 추가 (Mermaid 다이어그램)
- [x] "Hello World" 단일 파일 예시 추가
- [x] `open` vs `openAsync` 비교표 추가
- [x] `docs/` 링크 연결

**파일**: `README.md`

---

### M2-2: 시작하기 문서 작성 🟢
**작업 내용**:
- [x] `getting-started/introduction.md` 작성
- [x] `getting-started/quick-start.md` 작성
- [x] `getting-started/installation.md` 작성
- [x] `index.md` 상태 업데이트

**파일**: `docs/getting-started/*`

---

### M2-3: API Reference 문서 작성 🟢
**작업 내용**:
- [x] `api/dialog-store.md` 작성
- [x] `api/create-dialog-api.md` 작성
- [x] `api/use-dialog-controller.md` 작성
- [x] `api/dialogs-renderer.md` 작성
- [x] `api/types.md` 작성

**파일**: `docs/api/*`

---

### M2-4: 가이드 문서 작성 🟢
**작업 내용**:
- [x] `guides/basic-usage.md` 작성
- [x] `guides/async-dialogs.md` 작성 (기존 `06-renewal-dialog.md` 리팩터링 완료)
- [x] `guides/animations.md` 작성 (**핵심: 애니메이션 종료 후 unmount 호출 패턴 가이드**)
- [x] `guides/state-management.md` 작성

**파일**: `docs/guides/*`

---

### M2-5: Z-Index 전략 가이드 🟢
> Toast 등과 함께 사용 시 가이드 부재

**작업 내용**:
- [x] z-index 계층 구조 예시
- [x] `baseZIndex` 설정 가이드
- [x] 다른 오버레이 라이브러리와의 공존 패턴

**파일**: `docs/guides/z-index-strategy.md`

---

## M3: 테스트 강화

### M3-1: 엣지 케이스 테스트 추가 🟢
**작업 내용**:
- [x] 빈 스택에서 `close()` 호출
- [x] 중복 ID 에러 케이스
- [x] `closeAll` / `unmountAll` 테스트
- [x] `reject` 시나리오

**파일**: `index.test.ts`

---

### M3-2: 렌더러 테스트 추가 🟢
**작업 내용**:
- [x] `DialogsRenderer` 렌더링 테스트
- [x] `useDialogController` 훅 테스트
- [x] 컨텍스트 없이 호출 시 에러 테스트

**파일**: `renderer.test.tsx` (신규)

---

## M4: 품질 개선

### M4-1: `useMemo` 의존성 검토 🔴
> `store`가 의존성에 포함되어 있으나 변경되지 않음

**작업 내용**:
- [ ] `DialogInstance`의 `useMemo` 의존성 배열 정리
- [ ] 불필요한 리렌더링 확인

**파일**: `renderer.tsx`

---

### M4-2: `isMounted` 필드 정리 🟡
> 현재 코드에서 활용되지 않음

**작업 내용**:
- [ ] 향후 사용 계획 확정 또는 제거
- [ ] 타입 정의 업데이트

**파일**: `types.ts`, `store.ts`

---

### M4-3: Live Demo 링크 검증 🔴
**작업 내용**:
- [ ] GitHub Pages 배포 상태 확인
- [ ] CI에서 빌드/배포 검증
- [ ] README 링크 유효성 확인

---

## 우선순위 요약

| 우선순위 | 태스크 ID | 설명 |
|---------|----------|------|
| 🔴 즉시 | M2-1 | README 개편 |
| 🔴 즉시 | M2-2 | 시작하기 문서 |
| 🔴 즉시 | M1-5 | example 정리 |
| 🔴 즉시 | M2-1 | README 개편 |
| 🔴 즉시 | M2-2 | 시작하기 문서 |
| 🔴 즉시 | M4-1 | useMemo 정리 |
| 🔴 즉시 | M4-3 | Live Demo 검증 |
| 🟡 권장 | M1-4 | getStateFields 네이밍 |
| 🟡 권장 | M2-3, M2-4 | API/가이드 문서 |
| 🟡 권장 | M3-1 | 엣지 케이스 테스트 |
| 🟢 장기 | M1-2, M1-3 | resolve 확장, ID 규칙 |
| 🟢 장기 | M3-2, M4-2 | 추가 테스트, 코드 정리 |

---

## 작업 지시 방법

개별 작업 시작 시 다음 형식으로 지시:

```
M1-1 작업 시작해줘
```

또는

```
README 개편 작업 (M2-1) 진행해줘
```

각 작업은 독립적으로 진행 가능하며, 완료 시 이 문서의 체크박스를 업데이트합니다.
