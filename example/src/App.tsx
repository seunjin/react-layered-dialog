import { useDialogs, closeAll } from './lib/dialogs';
import { DialogRenderer } from './DialogRenderer';

function App() {
  const { dialogs, open, close } = useDialogs();

  const handleAsyncConfirm = () => {
    const dialogId = open('confirm', {
      title: '비동기 작업 확인',
      message: '확인을 누르면 1초 후 다이얼로그가 닫힙니다.',
      onConfirm: async () => {
        console.log('비동기 작업을 시작합니다...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('비동기 작업 완료. 다이얼로그를 닫습니다.');
        close(dialogId);
      },
      onCancel: () => {
        console.log('작업이 취소되었습니다.');
        close(dialogId);
      },
    });
    console.log(`다이얼로그가 열렸습니다. ID: ${dialogId}`);
  };

  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">
        React Layered Dialog - Shadcn Style
      </h1>
      <p className="mb-4">
        애니메이션이 적용된 기본 컴포넌트 예제입니다.
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAsyncConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          비동기 Confirm 열기
        </button>
        <button
          onClick={() =>
            open('alert', {
              title: '배경 없는 오버레이 테스트',
              message: '배경이 투명하지만, 바깥을 클릭하면 닫힙니다.',
              dimmed: false,
              closeOnOverlayClick: true,
            })
          }
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          배경 없는 Alert 열기
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

      {/* 이제 DialogRenderer를 한 번만 렌더링하면 됩니다. */}
      <DialogRenderer />
    </div>
  );
}

export default App;
