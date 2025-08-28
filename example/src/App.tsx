import { useDialogs, close, closeAll } from './lib/dialogs';
import { DialogRenderer } from './DialogRenderer';

function App() {
  const { dialogs, open } = useDialogs();

  const handleAsyncConfirm = () => {
    const dialogId = open('confirm', {
      id: 'asd',
      title: '비동기 작업 확인',
      message: '확인을 누르면 1초 후 다이얼로그가 닫힙니다.',
      onConfirm: async () => {
        // 1. onConfirm이 호출되어도 다이얼로그는 닫히지 않습니다.
        // 여기서 로딩 상태를 표시하는 등의 작업을 할 수 있습니다.
        console.log('비동기 작업을 시작합니다...');

        // 2. 비동기 작업 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 3. 작업 완료 후, 저장해 둔 ID로 직접 다이얼로그를 닫습니다.
        console.log('비동기 작업 완료. 다이얼로그를 닫습니다.');
        close();
      },
      onCancel: () => {
        console.log('작업이 취소되었습니다.');
        // 이제 onCancel을 전달했으므로, 여기서 직접 닫아주어야 합니다.
        close();
      },
    });
    console.log(`다이얼로그가 열렸습니다. ID: ${dialogId}`);
  };
  console.log(dialogs);
  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">
        React Layered Dialog - Async Control Example
      </h1>
      <p className="mb-4">
        onConfirm 콜백 내부에서 비동기 작업을 수행하고, 작업 완료 후 수동으로
        다이얼로그를 닫는 예제입니다.
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAsyncConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          비동기 Confirm 열기
        </button>
        {dialogs.length > 0 && (
          <button
            onClick={closeAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            모두 닫기
          </button>
        )}
      </div>

      <div className="mt-4 p-2 border rounded">
        <h3 className="font-bold">상태 정보:</h3>
        <p>열린 다이얼로그 수: {dialogs.length}</p>
      </div>

      {/* Render the dialogs */}
      {dialogs.map((dialog) => (
        <DialogRenderer key={dialog.state.id} dialog={dialog} />
      ))}
    </div>
  );
}

export default App;
