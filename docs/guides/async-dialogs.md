# 비동기 다이얼로그 (Async Dialogs)

비동기 다이얼로그 패턴은 사용자의 최종 응답(확인/취소 또는 데이터 입력)이 있을 때까지 로직을 대기시키고 싶을 때 사용합니다.

## `openAsync`와 `confirm`

`dialog.openAsync()` (또는 레지스트리에 설정된 `dialog.confirm()`)는 **Promise**를 반환합니다. 이를 통해 마치 `window.confirm()`처럼 동기적인 흐름의 코드를 작성할 수 있습니다.

### 기본 패턴

```tsx
const handleDelete = async () => {
  // 사용자가 버튼을 누를 때까지 여기서 대기합니다.
  const result = await dialog.confirm({
    title: '정말 삭제할까요?',
    message: '삭제된 데이터는 복구할 수 없습니다.'
  });

  // result.ok 값에 따라 분기 처리
  if (!result.ok) return;

  await api.deleteItem();
  alert('제거되었습니다.');
};
```

## 결과 데이터 전달 (`resolve`)

다이얼로그 내부에서 `resolve` 함수를 호출하여 호출부로 데이터를 전달할 수 있습니다.

### 컴포넌트 구현
```tsx
function PromptDialog(props) {
  const { resolve, close, unmount } = useDialogController();
  const [value, setValue] = useState('');

  const handleDone = () => {
    // 데이터와 함께 성공 상태 전달
    resolve({ ok: true, data: value });
    close();
    unmount();
  };

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={handleDone}>확인</button>
    </div>
  );
}
```

### 호출부 사용
```tsx
const result = await dialog.openAsync<Record<string, never>, string>(() => <PromptDialog />);

if (result.ok) {
  console.log('입력값:', result.data); // 'data' 필드에 값이 들어옵니다.
}
```

## 에러 핸들링 (`reject`)

네트워크 오류나 심각한 예외 상황이 발생하여 Promise를 에러로 종료해야 한다면 `reject`를 사용하세요.

```tsx
const handleSyncError = () => {
  try {
    const result = await dialog.openAsync(...);
  } catch (err) {
    console.error('다이얼로그 처리 중 오류 발생:', err);
  }
};
```

> [!IMPORTANT]
> 단순 취소(Cancel)는 `reject`가 아닌 `resolve({ ok: false })`를 사용하는 것이 비즈니스 흐름을 관리하기에 더 적합합니다.

## 비동기 다이얼로그 장점

1. **상태 관리 불필요**: 호출부에서 `isOpen` 같은 상태를 따로 만들 필요가 없습니다.
2. **가독성**: 로직이 단일 `async` 함수 내에 머무르므로 흐름을 파악하기 쉽습니다.
3. **타입 안전성**: 반환되는 `data`의 타입을 제네릭을 통해 명확히 보장할 수 있습니다.
