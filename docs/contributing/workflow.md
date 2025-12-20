# 개발 워크플로우 (Development Workflow)

이 문서는 코드 작성, 린트 검사, 테스트 실행 등 일상적인 개발 작업 절차를 설명합니다.

## 주요 명령어

프로젝트 루트 `package.json`에는 개발을 돕는 여러 스크립트가 설정되어 있습니다.

### 코드 스타일 검사 및 자동 수정

일관된 코드 스타일을 유지하기 위해 Prettier와 ESLint를 사용합니다.

- **코드 자동 정렬 (Formatting):**
  ```bash
  pnpm format
  ```
  이 명령어는 Prettier를 사용하여 프로젝트 내의 모든 코드(`*.{ts,tsx,js,jsx,json,md}`)를 설정된 규칙에 맞게 자동으로 정렬합니다.

- **코드 오류 검사 (Linting):**
  ```bash
  pnpm lint
  ```
  이 명령어는 ESLint를 사용하여 잠재적인 코드 오류나 스타일 문제를 찾아냅니다.

### 테스트

- **모든 테스트 실행:**
  ```bash
  pnpm test
  ```
  이 명령어는 Vitest를 실행하여 프로젝트 내의 모든 `*.test.ts` 파일을 찾아 테스트를 수행합니다.

- **UI 모드로 테스트 실행:**
  ```bash
  pnpm test:ui
  ```
  테스트 과정을 시각적인 UI와 함께 보고 싶을 때 사용합니다.

### 라이브러리 개발 서버 실행

`package`의 코드를 수정하면서 `example` 앱에서 바로 확인하고 싶을 때는 아래 명령어를 사용하세요.

```bash
# package 폴더에서 실행
pnpm dev
```
이 명령어는 `tsup`의 watch 모드를 사용하여, `package/src` 폴더의 파일이 변경될 때마다 자동으로 라이브러리를 다시 빌드합니다.
