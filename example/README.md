# react-layered-dialog Example

이 디렉토리는 `react-layered-dialog` 라이브러리의 **공식 데모 앱**입니다. 라이브러리의 주요 기능과 권장 사용 패턴을 실제 동작하는 코드로 확인할 수 있습니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** (빌드 도구)
- **shadcn/ui** (UI 컴포넌트)
- **Framer Motion** (애니메이션)

## 로컬 실행 방법

```bash
# 프로젝트 루트에서
pnpm install
pnpm dev
```

개발 서버가 실행되면 [http://localhost:5173](http://localhost:5173)에서 데모를 확인할 수 있습니다.

## 주요 파일 및 패턴

### 다이얼로그 등록 (`src/lib/dialogs.ts`)
```ts
export const dialog = createDialogApi(new DialogStore(), {
  confirm: { component: Confirm, mode: 'async' },
});
```

### 애니메이션 연동 패턴 (`src/components/dialogs/Confirm.tsx`)
- `AnimatePresence`의 `onExitComplete`에서 `unmount()`를 호출하여 애니메이션 종료 후 DOM 제거.
- `getProps(props)`를 통해 업데이트된 상태와 초기 Props를 안전하게 병합.

### 렌더러 배치 (`src/App.tsx`)
- `<ReactLayeredDialogRenderer store={dialog.store} />`를 앱 루트에 배치하여 모든 다이얼로그를 렌더링.

## 폴더 구조

```
example/
├── src/
│   ├── lib/dialogs.ts          # 스토어 및 API 싱글톤
│   ├── components/dialogs/     # 다이얼로그 컴포넌트들
│   ├── pages/                  # 라우팅된 데모 페이지들
│   └── App.tsx                 # 앱 엔트리 포인트
└── ...
```
