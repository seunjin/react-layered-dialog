# 상태 관리 (State Management)

`react-layered-dialog`는 다이얼로그의 Props를 스토어 상태로 관리하여, 외부와 내부 모두에서 동적으로 UI를 갱신할 수 있는 강력한 매커니즘을 제공합니다.

## `update`를 통한 실시간 UI 변경

`update` 메서드는 다이얼로그에 전달된Props의 일부를 갱신합니다. React의 `setState`처럼 기존 상태와 병합(Merge)됩니다.

### 외부에서 업데이트
```tsx
const handle = dialog.open(() => <DownloadProgress percent={0} />);

// 외부 작업 진행 상황에 따라 업데이트
api.onProgress((p) => {
  handle.update({ percent: p });
});
```

### 내부에서 업데이트
```tsx
function MyForm(props) {
  const { update } = useDialogController();
  
  return (
    <input 
      onChange={(e) => update({ memo: e.target.value })} 
      placeholder="자동으로 상태에 저장됩니다."
    />
  );
}
```

## `getProps`의 역할 🟢

`getProps`는 다음 두 데이터를 안전하게 병합하여 최신 값을 보장합니다:
1. 다이얼로그를 처음 열 때 전달한 **초기 Props**
2. `update`를 통해 변경된 **스토어의 최신 상태**

컴포넌트가 다시 렌더링될 때마다 이 둘을 합쳐서 완결된 데이터를 제공하므로, 개발자는 복잡한 병합 로직을 고민할 필요가 없습니다.

```tsx
function Dialog(props) {
  const { getProps } = useDialogController();
  // props는 초기값, getProps(props)는 현재 스토어의 실제값
  const { message } = getProps(props);
  return <div>{message}</div>;
}
```

## 상태 모니터링 (`setStatus`)

`status`는 비즈니스 흐름상 현재 다이얼로그가 어떤 단계에 있는지 나타내는 메타데이터입니다.

- **종류**: `'idle' | 'loading' | 'done' | 'error'`
- **용도**: 버튼의 로딩 인디케이터 표시, 성공 메시지 노출 등

```tsx
const handleConfirm = async () => {
  setStatus('loading'); // 버튼을 비활성화하고 스피너 표시
  try {
    await api.submit();
    setStatus('done'); // 성공 아이콘 표시
  } catch {
    setStatus('error'); // 에러 메시지 노출
  }
};
```

## 요약

- **`update`**: 데이터(Props)를 바꿀 때 사용.
- **`setStatus`**: 상태 의미(Status)를 바꿀 때 사용.
- **`getProps`**: 렌더링 시 항상 최신 데이터를 읽어올 때 사용.
