# 3. 버전 관리 및 배포

이 문서는 `react-layered-dialog`의 새 버전을 npm에 배포하는 전체 과정을 안내합니다.
이 프로젝트는 `pnpm` 워크스페이스와 `changesets`를 사용하여 버전 관리 및 배포를 자동화합니다.

## 표준 배포 절차

아래의 5단계를 순서대로 진행하세요.

### 1. 변경사항 기록하기

기능 추가, 버그 수정 등 의미 있는 변경 작업을 완료한 후, 다음 명령어를 실행하여 변경사항을 기록합니다.

```bash
pnpm changeset
```

이 명령어는 대화형 인터페이스를 제공합니다.

-   **패키지 선택**: 변경된 패키지(`react-layered-dialog`)를 스페이스바로 선택하고 Enter를 누릅니다.
-   **버전 결정**: 변경사항의 종류에 따라 `Major`, `Minor`, `Patch` 중 하나를 선택합니다.
-   **요약 작성**: `CHANGELOG.md`에 기록될 변경사항 요약을 작성합니다.

완료되면 `.changeset` 폴더 안에 마크다운 파일이 생성됩니다. 이 파일을 Git에 커밋해야 합니다.

### 2. 버전 파일 생성하기

기록된 변경사항(`changeset` 파일)을 바탕으로 실제 패키지 버전과 `CHANGELOG.md` 파일을 업데이트합니다.

```bash
pnpm changeset version
```

### 3. 버전 업데이트 커밋 및 푸시하기

`changeset version` 명령어로 변경된 파일들(`package.json`, `CHANGELOG.md` 등)을 Git에 커밋하고 원격 저장소에 푸시합니다.

```bash
git add .
git commit -m "chore: version packages for release"
git push
```

### 4. NPM에 배포하고 Git 태그 생성하기

준비된 패키지를 NPM 레지스트리에 배포합니다. 이 명령어는 배포 성공 후 자동으로 Git 태그(예: `react-layered-dialog@0.1.1`)를 생성합니다.

**주의**: 이 명령어를 실행하기 전에 `npm login`을 통해 npm 계정에 로그인되어 있어야 합니다.

```bash
pnpm run release:publish
```

### 5. 생성된 태그 푸시하기

마지막으로, 로컬에 생성된 Git 태그를 원격 저장소(GitHub)에 푸시하여 릴리즈를 완료합니다.

```bash
git push --tags
```