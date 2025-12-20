# 다중 스토어 운영 (Multiple Stores)

대부분의 앱은 하나의 전역 스토어로 충분하지만, 특정 영역(예: 임베디드 캔버스, 어드민 사이드바 등)에서 독립적인 다이얼로그 스택이 필요한 경우 여러 스토어를 운영할 수 있습니다.

## 독립된 스택 구성하기

각 스토어는 완전히 분리된 `entries` 배열과 `zIndex` 카운터를 가집니다.

```ts
// 1. 스토어 인스턴스를 각각 생성
const mainStore = new DialogStore({ baseZIndex: 1000 });
const sideStore = new DialogStore({ baseZIndex: 5000 });

// 2. API 생성
export const dialog = createDialogApi(mainStore, mainRegistry);
export const sideDialog = createDialogApi(sideStore, sideRegistry);
```

## 렌더링 위치 지정

각 스토어에 대응하는 `DialogsRenderer`를 필요한 위치에 각각 배치합니다.

```tsx
function App() {
  return (
    <>
      <MainLayout />
      {/* 메인 다이얼로그 렌더러 */}
      <DialogsRenderer store={mainStore} />
      
      <Sidebar>
        {/* 사이드바 전용 다이얼로그 렌더러 */}
        <DialogsRenderer store={sideStore} />
      </Sidebar>
    </>
  );
}
```

## 주의사항

1. **Z-Index 충돌**: 여러 스토어가 동일한 루트(Body)에 렌더링된다면 `baseZIndex` 값이 겹치지 않도록 충분한 간격을 두어야 합니다.
2. **컨텍스트 혼선**: `useDialogController`는 현재 자신을 렌더링한 `DialogsRenderer`가 속한 스토어의 정보를 자동으로 가져옵니다. 별도의 처리가 없어도 올바른 스토어와 연결됩니다.

## 활용 사례: 마이크로 프론트엔드 (MFE)

독립적인 모듈별로 다이얼로그 시스템을 구축해야 하는 경우, 각 모듈이 자신만의 `DialogStore`를 소유하게 함으로써 전역 상태 오염 없이 다이얼로그를 관리할 수 있습니다.
