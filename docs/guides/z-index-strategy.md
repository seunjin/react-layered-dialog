# Z-Index 전략 가이드 (Z-Index Strategy)

`react-layered-dialog`는 다중 다이얼로그 환경에서 복잡한 `z-index` 계산을 자동화합니다. 이 가이드는 라이브러리의 관리 방식과 다른 오버레이 요소들과의 공존 전략을 다룹니다.

## 자동 Z-Index 관리 원리

`DialogStore`는 다이얼로그가 열릴 때마다 증가하는 일련번호를 기반으로 `zIndex`를 할당합니다.

1. **`baseZIndex`**: 스토어 생성 시 설정한 시작 값입니다 (기본값: `1000`).
2. **순차 할당**: 새로운 다이얼로그가 열릴 때마다 이전 값보다 큰 값을 부여받아 항상 위에 표시됩니다.
3. **자동 리셋**: 모든 다이얼로그가 닫히면 카운터가 다시 `baseZIndex`로 초기화되어 메모리 및 번호 낭비를 방지합니다.

## `baseZIndex` 커스터마이징

프로젝트의 기존 UI 환경에 맞춰 시작 번호를 조정할 수 있습니다.

```ts
// src/lib/dialogs.ts
import { DialogStore } from 'react-layered-dialog';

// 헤더나 내비게이션 바가 500 수준이라면 다이얼로그는 1000부터 시작하도록 설정
export const store = new DialogStore({ baseZIndex: 1000 });
```

## 오버레이 계층 구조 가이드

애플리케이션 전체의 시각적 위계를 위해 다음과 같은 z-index 계층 구조를 권장합니다.

| 계층 (Layer) | 권장 범위 | 설명 |
| :--- | :--- | :--- |
| **Normal UI** | 0 ~ 99 | 일반적인 콘텐츠 |
| **Sticky/Fixed** | 100 ~ 499 | 헤더, 내비게이션 바, 부동 버튼 |
| **Popovers** | 500 ~ 999 | 드롭다운, 툴팁, 셀렉트 박스 |
| **Dialogs** | **1000 ~ 1999** | **본 라이브러리가 관리하는 영역** |
| **Toasts** | 2000+ | 시스템 알림 (Toast) |

## 외부 라이브러리와의 공존

### 1. Toast (react-toastify, sonner 등)
토스트 메시지는 사용자 인터랙션과 무관하게 항상 최상위에 나타나야 하므로, 다이얼로그보다 높은 `z-index`를 유지하는 것이 좋습니다. 대부분의 토스트 라이브러리는 컨테이너 설정에서 이를 조정할 수 있습니다.

### 2. Select/Dropdown (Radix-UI, Headless UI 등)
다이얼로그 안에서 열리는 드롭다운은 해당 다이얼로그의 `zIndex`를 기준으로 상대적으로 높아야 합니다. 
`react-layered-dialog`는 헤드리스 정책을 따르므로, 다이얼로그 내부 요소의 z-index는 CSS나 컴포넌트 Props를 통해 자유롭게 조절하면 됩니다.

```tsx
function MyDialog(props) {
  const { zIndex } = useDialogController();
  
  return (
    <div style={{ zIndex }}>
      {/* 이 안의 툴팁은 zIndex + 1 등을 활용하거나 CSS 겹침 순서를 이용 */}
      <MyTooltip style={{ zIndex: 1 }}>...</MyTooltip>
    </div>
  );
}
```

## 요약

- 다이얼로그의 순서는 라이브러리가 자동으로 관리합니다.
- 프로젝트 전체의 레이어 설계를 위해 `baseZIndex`를 적절히 설정하세요.
- 사용자에게 가장 중요한 알림(Toast)은 다이얼로그보다 항상 높은 계층에 두는 것이 실무적인 Best Practice입니다.
