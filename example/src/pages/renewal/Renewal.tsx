import { DocArticle } from '@/components/docs/DocArticle';
import { Button } from '@/components/ui/button';
import { openRenewalDialog } from '@/lib/renewalDialogs';
import { useDialogController } from 'react-layered-dialog';

type CounterState = {
  count: number;
  step?: 'idle' | 'loading';
  onIncrement?: () => void;
  onClose?: () => void;
};
type NotificationState = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose?: () => void;
};

type CounterDialogProps = Partial<CounterState>;
type CounterDialogOptions = {
  // zIndex?: number;
  useDim?: boolean;
  scrollLock?: boolean;
};

const CounterDialog = (props: CounterDialogProps = {}) => {
  const { update, unmount, closeAll, stack, getStateFields, options } =
    useDialogController<CounterState, CounterDialogOptions>();

  const { count, step, onIncrement, onClose } = getStateFields({
    count: props.count ?? 0,
    step: props.step ?? 'idle',
    onIncrement: props.onIncrement,
    onClose: props.onClose,
  });

  const dimmed = options.useDim ?? true;

  const handleIncrement = () => {
    if (onIncrement) {
      onIncrement();
      return;
    }
    update({ count: count + 1, step: 'loading' });
    setTimeout(() => {
      update({ step: 'idle' });
    }, 600);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    unmount();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        dimmed ? 'bg-black/40' : 'bg-transparent'
      }`}
      style={{ zIndex: options.zIndex }}
    >
      <div className="w-[min(340px,90%)] space-y-4 rounded-xl bg-card p-6 shadow-xl">
        <header>
          <h3 className="text-lg font-semibold">Renewal Counter Dialog</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            topId: {stack.topId ?? '없음'} · position: {stack.index + 1}/
            {stack.size}
          </p>
        </header>
        <div className="flex items-center justify-between rounded border bg-muted/40 px-3 py-2 text-sm">
          <span>현재 카운트</span>
          <span className="text-xl font-semibold">{count}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          상태: {step === 'loading' ? '증가 중...' : '대기'}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            닫기
          </Button>
          <Button onClick={handleIncrement}>+1</Button>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => closeAll()}>
            전체 닫기
          </Button>
        </div>
      </div>
    </div>
  );
};

type NotificationDialogProps = Partial<NotificationState>;
type NotificationDialogOptions = {
  useDim?: boolean;
  zIndex?: number;
};

const NotificationDialog = (props: NotificationDialogProps = {}) => {
  const { update, unmount, getStateFields, options } = useDialogController<
    NotificationState,
    NotificationDialogOptions
  >();

  const { title, message, onConfirm, onClose } = getStateFields({
    title: props.title ?? '알림',
    message:
      props.message ??
      '처리가 완료되었습니다. 초기 메시지를 업데이트해 보세요.',
    onConfirm: props.onConfirm,
    onClose: props.onClose,
  });

  const dimmed = options.useDim ?? true;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
      return;
    }
    update({ message: '메시지가 state 기반으로 업데이트되었습니다.' });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    unmount();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        dimmed ? 'bg-black/20' : 'bg-transparent'
      }`}
      style={{ zIndex: options.zIndex }}
    >
      <div className="w-[min(320px,90%)] space-y-4 rounded-lg bg-background p-5 shadow-lg">
        <header>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </header>
        <div className="flex justify-between gap-2">
          <Button variant="outline" size="sm" onClick={handleConfirm}>
            메시지 업데이트
          </Button>
          <Button size="sm" onClick={handleClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

const Renewal = () => {
  const handleCounterDialogOpen = () => {
    openRenewalDialog(() => <CounterDialog count={0} />, {
      useDim: true,
      scrollLock: true,
    });
  };

  const handleNotificationDialogOpen = () => {
    openRenewalDialog(
      ({ update, unmount }) => (
        <NotificationDialog
          title="삭제 완료"
          message="카테고리를 삭제했습니다. 열려 있는 카운터 다이얼로그와 비교해 보세요."
          onConfirm={() => {
            update({ message: '모든 항목이 성공적으로 처리되었습니다.' });
            openRenewalDialog(() => <CounterDialog count={0} />, {
              useDim: true,
              scrollLock: true,
            });
          }}
          onClose={() => unmount()}
        />
      ),
      { zIndex: 1300, useDim: true }
    );
  };

  return (
    <DocArticle title="Renewal Library 데모">
      <p className="text-sm text-muted-foreground">
        리뉴얼된 API는 JSX를 직접 받아 다이얼로그를 렌더링합니다. 아래 버튼을
        눌러 새로운 스토어 기반 다이얼로그를 체험해 보세요.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={handleCounterDialogOpen}>
          카운터 다이얼로그 열기
        </Button>
        <Button variant="outline" onClick={handleNotificationDialogOpen}>
          알림 다이얼로그 열기
        </Button>
      </div>
    </DocArticle>
  );
};

export default Renewal;
