# 문서 마이그레이션 계획 (DialogStore 기반 API)

## 1. 목표
- 예제/문서 전반에서 레거시 API(`createDialogManager`, `createUseDialogs`, 레거시 `useLayerBehavior` 패턴 등)를 제거한다.
- `DialogStore + createDialogApi + useDialogController` 조합을 중심으로 새 API 흐름을 정리하고, 독자가 단계적으로 이해할 수 있는 문서 구조를 마련한다.
- 코드 템플릿/가이드/예제 앱이 모두 동일한 용어와 패턴을 사용하도록 동기화한다.

## 2. 현재 상태 진단
- 제거 대상
  - Guides: `useLayerBehavior 활용` 페이지 (새 API 설명과 중복, 레거시 import 예제 포함)
  - API: `useLayerBehavior` 항목, 레거시 시그니처 기반 설명
  - Core: 일부 페이지에서 `createDialogManager`, `createUseDialogs`, `DialogState<T>` 중심의 레거시 흐름 언급
  - 코드 템플릿에 남아 있는 레거시 props 패턴 (`DialogState<...>`, `closeDialog(id)` 등)
- 이미 업데이트된 항목
  - Quick Start, Architecture, API(createDialogApi/DialogStore), Core Types, Defining Dialogs
  - 실제 다이얼로그 컴포넌트/렌더러 (`example/src/components/dialogs/...`)
- 확인 필요 항목
  - README(패키지/루트) vs 문서 내 용어 일관성
  - 사이트 내 메뉴/라우팅이 새 구조와 맞는지 재점검

## 3. 새 문서 구조(초안)
### Getting Started
1. Introduction (개념 소개)
2. Quick Start (DialogStore + createDialogApi + useDialogController 흐름)

### Core
1. Architecture (스토어/레지스트리/렌더러 개요)
2. Defining Dialogs (props/옵션 설계)
3. Core Types (스토어 스냅샷, 컨트롤러 계약)
4. Controller Patterns (신규) – `close/update/setStatus` 등 컨트롤러 활용 예시

### API
1. DialogStore
2. createDialogApi
3. DialogApi Methods (open/openAsync/update 등)
4. (선택) useDialogController & DialogsRenderer – 컨트롤러/렌더러 내부 동작

### Guides
1. Opening & Closing (imperative + declarative 예시)
2. Updating States (openAsync, update, status)
3. Async Handling (기존 가이드 정리)
4. Controller Patterns (컨트롤러 기반 상호작용 정리)
5. Custom Rendering (렌더러 확장, scroll-lock, 애니메이션)

### Examples
- Live Showcase
- Renewal Demo (DialogStore 공유 예시)

## 4. 작업 체크리스트
- [x] Guides > 기존 `useLayerBehavior 활용` 페이지 제거 또는 새 패턴 소개로 대체
- [x] API > `useLayerBehavior` 항목 삭제, `DialogStore`, `createDialogApi`, `DialogsRenderer/useDialogController` 정리
- [x] Core > `Defining Dialogs`, `Core Types` 추가 설명 마무리 및 예제 코드 최신화
- [ ] README(패키지/루트)와 문서 간 예제 코드 일관성 재검토
- [ ] 코드 템플릿: Alert/Confirm/Modal 관련 파일이 모두 새 API/컨트롤러 패턴을 따르는지 검증
- [ ] 문서 내 링크/라우트(`router.tsx`)가 새 목차를 반영하는지 확인
- [ ] 빌드/배포 전 lint, test, build 이후 docs 빌드 확인

## 5. 검증 계획
- `pnpm lint` / `pnpm test` / `pnpm build` 기본 검증
- 문서 사이트 빌드 (`pnpm --filter docs build` 혹은 해당 스크립트) 및 로컬 미리보기로 링크/콘텐츠 확인
- 예제 앱 실행 시 다이얼로그 동작과 문서의 안내가 일치하는지 QA
- 변경 후 README/문서 링크 점검 (404 없는지)

## 6. 향후 고려 사항
- 레거시 API 제거 후 패키지 CHANGELOG/문서에 마이그레이션 가이드를 추가할지 여부
- `useLayerBehavior`를 별도 애드온으로 유지할지, 컨트롤러 패턴과 통합할지 결정
- Storybook 등의 추가 문서화 도구 필요성 검토
