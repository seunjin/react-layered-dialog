import Confirm, { type ConfirmProps } from '@/components/dialogs/Confirm';
import { DocArticle } from '@/components/docs/DocArticle';
import { Button } from '@/components/ui/button';
import { dialog } from '@/lib/dialogs';
import type { DialogRenderFn } from 'react-layered-dialog';

const Renewal = () => {
  const handleSingleDialogOpen = () => {
    dialog.open(() => (
      <Confirm title="단일 Confirm" message="단일 Confirm 테스트입니다." />
    ));
  };

  const handleMultiDialogOpen = () => {
    const secondRenderer: DialogRenderFn<ConfirmProps> = ({ closeAll }) => (
      <Confirm
        title="멀티 Confirm"
        message="두 번째 Confirm입니다."
        confirmLabel="모두 닫기"
        onConfirm={closeAll}
      />
    );

    const firstResult = dialog.open<ConfirmProps>(() => (
      <Confirm
        title="멀티 Confirm"
        message="첫 번째 Confirm입니다."
        confirmLabel="두 번째 Confirm 열기"
      />
    ));

    firstResult.update({
      onConfirm() {
        dialog.open(secondRenderer); // 같은 렌더러를 재사용해 필요할 때 다시 연다.
      },
    });
  };

  const handleAsyncConfirmDialogOpen = async () => {
    const result = await dialog.confirm((controller) => ({
      title: '정말로 삭제할까요?',
      message: '이 동작은 되돌릴 수 없습니다.',
      confirmLabel: '삭제',
      cancelLabel: '취소',
      onConfirm: () => controller.resolve?.({ ok: true }),
    }));
    if (!result.ok) {
      return;
    }

    result.setStatus('loading');
    await new Promise((done) => setTimeout(done, 700));

    result.setStatus('done');
    result.update({
      title: '삭제 완료',
      message: `다이얼로그 ${result.dialog.id}에서 resolve되었습니다.`,
      confirmLabel: '확인',
      onConfirm() {
        result.close();
      },
    });
  };

  return (
    <DocArticle title="Renewal Library 데모">
      <p className="text-sm text-muted-foreground">
        리뉴얼된 API는 JSX를 직접 받아 다이얼로그를 렌더링합니다. 아래 버튼을
        눌러 다양한 Confirm 시나리오를 확인해 보세요.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleSingleDialogOpen}>단일 Confirm 열기</Button>
        <Button variant="outline" onClick={handleMultiDialogOpen}>
          중첩 Confirm 열기
        </Button>
        <Button onClick={handleAsyncConfirmDialogOpen}>
          비동기 Confirm 열기
        </Button>
        <Button onClick={() => dialog.confirm({ title: 'sd', message: 'dasd' })}>
          비동기 Confirm 열기
        </Button>
      </div>
    </DocArticle>
  );
};

export default Renewal;
