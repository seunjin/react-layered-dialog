# 3. 버전 관리 및 배포

이 문서는 [Changesets](https://github.com/changesets/changesets)를 사용하여 라이브러리의 새 버전을 만들고 npm에 배포하는 과정을 설명합니다.

## 배포 절차

### 1. 변경 사항 기록 (Adding a Changeset)

라이브러리 코드를 수정한 후 (예: 버그 수정, 기능 추가), 다음 명령어를 실행하여 변경점을 기록해야 합니다.

```bash
pnpm changeset
```

이 명령어를 실행하면, 어떤 패키지가 변경되었는지, 버전(Major, Minor, Patch)을 어떻게 올릴지, 그리고 변경 내용에 대한 요약을 작성하라는 안내가 나옵니다.

- **Patch**: 버그 수정 등 하위 호환성을 해치지 않는 작은 변경
- **Minor**: 하위 호환성을 해치지 않는 새로운 기능 추가
- **Major**: 하위 호환성을 해치는 큰 변경 (breaking change)

안내에 따라 내용을 입력하면 `.changeset` 폴더 안에 고유한 이름의 마크다운 파일이 생성됩니다. 이 파일을 Git에 커밋해야 합니다.

### 2. 버전 적용 및 Changelog 생성

라이브러리를 배포할 준비가 되면, 다음 명령어를 실행합니다.

```bash
pnpm release:version
```

이 명령어는 `.changeset` 폴더 안의 모든 마크다운 파일들을 소모하여 다음 두 가지 작업을 자동으로 수행합니다.

- `package/package.json`의 `version` 필드를 적절하게 업데이트합니다.
- `package/CHANGELOG.md` 파일을 생성하거나 업데이트합니다.

이 명령어를 실행한 후, 변경된 `package.json`과 `CHANGELOG.md` 파일을 Git에 커밋합니다.

### 3. npm에 배포

마지막으로, 다음 명령어를 실행하여 npm 레지스트리에 패키지를 배포합니다.

```bash
pnpm release:publish
```

이 명령어는 먼저 라이브러리를 빌드한 후, `changeset publish` 명령을 통해 npm에 배포를 시도합니다.

**주의:** npm에 배포하기 위해서는 [npm 계정에 로그인](https://docs.npmjs.com/cli/v10/commands/npm-login)이 되어 있어야 합니다.
