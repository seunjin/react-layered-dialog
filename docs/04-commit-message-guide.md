# 4. 커밋 메시지 가이드

이 프로젝트는 일관성 있는 Git 커밋 히스토리를 위해 **Conventional Commits** 명세(specification)를 따릅니다. 이 가이드는 커밋 메시지를 작성하는 규칙을 설명합니다.

## 왜 Conventional Commits를 사용하는가?

- **가독성 향상**: 커밋 히스토리만으로 프로젝트의 변경 사항을 쉽게 이해할 수 있습니다.
- **변경 이력 자동화**: `CHANGELOG.md` 파일을 자동으로 생성할 수 있습니다.
- **버전 관리 자동화**: `feat`, `fix` 같은 커밋 유형을 기반으로 다음 배포 버전을 자동으로 결정할 수 있습니다. (Changesets 연동)

## 커밋 메시지 구조

커밋 메시지는 다음과 같은 구조를 가집니다.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

---

### 1. `type` (필수)

커밋의 종류를 나타냅니다. `commitlint`가 아래 목록에 있는 `type`만 허용합니다.

- **`feat`**: 새로운 기능 추가
- **`fix`**: 버그 수정
- **`docs`**: 문서 변경 (README, 개발 가이드 등)
- **`style`**: 코드의 의미에 영향을 주지 않는 스타일 변경 (포맷팅, 세미콜론 등)
- **`refactor`**: 버그 수정이나 기능 추가가 아닌 코드 리팩토링
- **`test`**: 테스트 코드 추가 또는 수정
- **`build`**: 빌드 시스템이나 외부 의존성 변경 (예: `package.json` 수정)
- **`ci`**: CI/CD 설정 파일 변경
- **`chore`**: 그 외 자잘한 변경 (소스나 테스트 파일을 수정하지 않는 변경)

### 2. `scope` (선택)

커밋이 영향을 미치는 범위를 나타냅니다. 예를 들어 `feat(auth): ...` 처럼 괄호 안에 명시할 수 있습니다.

### 3. `subject` (필수)

커밋에 대한 매우 짧은 요약입니다.

- 50자를 넘지 않도록 하고, 마침표를 찍지 않습니다.
- 과거형이 아닌 현재형으로, 명령문처럼 작성합니다. (예: "Add" not "Added")

### 4. `body` (선택)

`subject`만으로 설명이 부족할 때, 변경의 이유와 상세 내용을 작성합니다. `subject`와 한 줄을 띄고 작성합니다.

### 5. `footer` (선택)

Breaking Change(하위 호환성을 해치는 변경)나, 특정 이슈를 참조할 때 사용합니다.

- **Breaking Change**: `BREAKING CHANGE:` 라는 접두사로 시작합니다.
- **이슈 참조**: `Closes #123`, `Fixes #456` 와 같이 작성합니다.

---

## 예시

**간단한 기능 추가**
```
feat: allow users to upload avatars
```

**상세 설명이 포함된 버그 수정**
```
fix: prevent racing condition on user login

The user login process could sometimes lead to a racing
condition when the user clicks the login button multiple
times in quick succession. This commit adds a flag to
disable the button after the first click.

Closes #78
```

**Breaking Change가 포함된 리팩토링**
```
refactor: restructure user authentication module

The authentication module is completely redesigned to support
OAuth2 providers.

BREAKING CHANGE: The `login` function now returns a promise
instead of accepting a callback.
```
