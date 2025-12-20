# 개발 환경 설정 (Development Setup)

이 문서는 `react-layered-dialog` 라이브러리의 기여를 위한 로컬 개발 환경 설정 방법을 가이드합니다.

## 사전 준비

- [Node.js](https://nodejs.org/) (v18 이상 권장)
- [pnpm](https://pnpm.io/installation)

## 설정 절차

1.  **저장소 복제 (Clone):**
    ```bash
    # <repository-url> 부분에 실제 Git 저장소 주소를 입력하세요.
    git clone <repository-url>
    cd react-layered-dialog
    ```

2.  **의존성 설치:**
    이 프로젝트는 [pnpm](https://pnpm.io/)을 패키지 매니저로 사용합니다. 프로젝트의 루트 디렉터리에서 아래 명령어를 실행하여 워크스페이스의 모든 의존성을 설치하세요.

    ```bash
    pnpm install
    ```

    이 명령어는 ESLint, Prettier, Vitest 등 개발에 필요한 모든 도구를 설치하고, `package`와 `example` 같은 로컬 패키지들을 서로 연결해줍니다. 이 과정이 끝나면 개발을 시작할 준비가 완료됩니다.
