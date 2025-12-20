# 설치 (Installation)

애플리케이션에 `react-layered-dialog`를 추가하는 방법입니다.

## 패키지 설치

선호하는 패키지 매니저를 사용하여 설치하세요.

```bash
# pnpm
pnpm add react-layered-dialog

# npm
npm install react-layered-dialog

# yarn
yarn add react-layered-dialog
```

## 요구 사항

- **React 18.0.0** 이상 (React 18의 `useSyncExternalStore`를 사용합니다.)
- **TypeScript 4.7** 이상 권장 (타입 안정성을 최대한 활용하기 위해 권장합니다.)

## TypeScript 설정

라이브러리는 기본적으로 타입 정의를 포함하고 있습니다. 특별한 추가 설정 없이도 대부분의 환경에서 즉시 동작하지만, `tsconfig.json`에서 `strict` 모드를 사용하면 더욱 강력한 타입 검사 혜택을 누릴 수 있습니다.

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "Node",
    "jsx": "react-jsx"
  }
}
```

## 다음 단계

설치가 완료되었다면, [빠른 시작 (Quick Start)](./quick-start.md)으로 이동하여 첫 번째 다이얼로그를 띄워보세요.
