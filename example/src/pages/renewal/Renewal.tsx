import Confirm from '@/components/dialogs/Confirm';
import { DocArticle } from '@/components/docs/DocArticle';
import { Button } from '@/components/ui/button';
import { dialog } from '@/lib/dialogs';

const Renewal = () => {
  // ─── 단순 알림 ──────────────────────────────────────────────────────────────
  const handleAlertOpen = () => {
    dialog.alert({
      title: '알림',
      message: '저장이 완료되었습니다.',
      cancelLabel: '',   // 빈 문자열 → 취소 버튼 숨김
    });
  };

  // ─── 중첩 다이얼로그 ─────────────────────────────────────────────────────────
  // onConfirm 콜백 안에서 두 번째 다이얼로그를 열어 레이어를 쌓습니다.
  const handleNestedOpen = () => {
    dialog.store.open(() => (
      <Confirm
        title="1단계"
        message="두 번째 다이얼로그를 열겠습니까?"
        confirmLabel="다음"
        onConfirm={() => {
          dialog.store.open(() => (
            <Confirm
              title="2단계"
              message="두 다이얼로그를 모두 닫으시겠습니까?"
              confirmLabel="모두 닫기"
              cancelLabel="취소"
              onConfirm={dialog.closeAll}
            />
          ));
        }}
      />
    ));
  };

  // ─── 비동기 Confirm ──────────────────────────────────────────────────────────
  // onConfirm에서 resolve만 호출하고 close는 호출하지 않습니다.
  // 그래야 await 재개 후 로딩 → 완료 상태를 다이얼로그에 보여줄 수 있습니다.
  const handleAsyncConfirm = async () => {
    const result = await dialog.confirm((controller) => ({
      title: '정말로 삭제할까요?',
      message: '이 동작은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      cancelLabel: '취소',
      onConfirm: () => controller.resolve?.({ ok: true }),
    }));

    if (!result.ok) return;

    result.setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 700));

    result.setStatus('done');
    result.update({
      title: '삭제 완료',
      message: `다이얼로그 ${result.ref.id}가 처리되었습니다.`,
      confirmLabel: '닫기',
      onConfirm: result.close,
    });
  };

  return (
    <DocArticle title="Live Showcase">
      <p className="text-sm text-muted-foreground">
        라이브러리의 주요 기능을 직접 확인할 수 있는 인터랙티브 데모입니다.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={handleAlertOpen}>
          단순 알림
        </Button>
        <Button variant="outline" onClick={handleNestedOpen}>
          중첩 다이얼로그
        </Button>
        <Button onClick={handleAsyncConfirm}>비동기 Confirm</Button>
      </div>
    </DocArticle>
  );
};

export default Renewal;
