# 커스텀 레지스트리 심화 (Custom Registry)

`createDialogApi`와 `defineDialog`를 활용하여 프로젝트에 특화된 다이얼로그 호출 인터페이스를 구축하는 방법을 다룹니다.

## `defineDialog` 상세 설정

단순히 컴포넌트만 등록하는 대신, 다양한 옵션을 통해 동작을 세밀하게 제어할 수 있습니다.

```ts
export const myDialogs = {
  // 1. 기본 설정 (동기 모드)
  alert: defineDialog(AlertDialog),

  // 2. 비동기 모드 및 표시 이름 지정
  confirm: defineDialog(ConfirmDialog, { 
    mode: 'async', 
    displayName: 'GlobalConfirm' 
  }),
};
```

## 복잡한 다이얼로그 래핑

공통 레이아웃이 포함된 다이얼로그를 정의할 때 `defineDialog` 내부에서 래퍼를 구성할 수 있습니다.

```tsx
const registry = {
  profile: defineDialog((props: ProfileProps) => {
    // 공통 프레임워크나 애니메이션 래퍼를 여기서 적용할 수 있습니다.
    return (
      <DialogFrame title="사용자 정보">
        <ProfileContent {...props} />
      </DialogFrame>
    );
  })
} as const;
```

## 타입 추론 활용

`createDialogApi`는 전달된 레지스트리의 타입을 분석하여 자동으로 메서드 시그니처를 생성합니다.

- **Sync 모드**: `(props, options) => DialogOpenResult`
- **Async 모드**: `(props, options) => Promise<DialogAsyncResult>`

```ts
const api = createDialogApi(store, registry);

// IDE에서 'title'과 'content' 타입을 자동으로 추천합니다.
api.confirm({ title: '수정', content: '입력하세요' }); 
```

## 레지스트리 분리 패턴

애플리케이션의 규모가 커지면 도메인별로 다이얼로그 레지스트리를 분리하여 관리하는 것이 유지보수에 유리합니다.

```ts
// authDialogs.ts, userDialogs.ts 등으로 분리
const fullRegistry = {
  ...authDialogs,
  ...userDialogs,
} as const;

export const dialog = createDialogApi(store, fullRegistry);
```
