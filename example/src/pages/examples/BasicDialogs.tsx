import { TypographyH2, TypographyP } from '@/components/ui/typography';
import type { ReactNode } from 'react';

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
    <code>{children}</code>
  </pre>
);

export const BasicDialogs = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>기본 다이얼로그: Alert & Confirm</TypographyH2>
      <TypographyP>
        가장 일반적으로 사용되는 `Alert`와 `Confirm` 컴포넌트의 예시입니다. 이
        컴포넌트들은 `lib/dialogs.ts`에 정의된 `AlertState`와 `ConfirmState`
        타입을 `props`로 받습니다.
      </TypographyP>
    </div>

    <div>
      <TypographyP>
        <strong>Alert.tsx</strong>
      </TypographyP>
      <CodeBlock>
        {`import { useEffect, useCallback } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { AlertState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

type AlertProps = DialogState<AlertState>;

export const Alert = ({
  title,
  message,
  onOk,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = false,
  dismissable = false,
}: AlertProps) => {
  const { dialogs, closeDialog } = useDialogs();

  const handleOk = useCallback(() => {
    onOk?.();
    closeDialog();
  }, [onOk, closeDialog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog = dialogs.length > 0 && dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        handleOk();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissable, handleOk, dialogs, zIndex]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      handleOk();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        className={\`absolute inset-0 \${dimmed ? 'bg-black/20' : 'bg-transparent'}\`}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleOk}>확인</Button>
        </div>
      </motion.div>
    </div>
  );
};
`}
      </CodeBlock>
    </div>

    <div>
      <TypographyP>
        <strong>Confirm.tsx</strong>
      </TypographyP>
      <CodeBlock>
        {`import { useEffect, useCallback } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

type ConfirmProps = DialogState<ConfirmState>;

export const Confirm = ({
  title,
  message,
  onConfirm,
  onCancel,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = false,
  dismissable = false,
}: ConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
  }, [onCancel, closeDialog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog = dialogs.length > 0 && dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissable, handleCancel, dialogs, zIndex]);

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      handleCancel();
    }
  };
 
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
    >
      <motion.div
        className={\`absolute inset-0 \${dimmed ? 'bg-black/20' : 'bg-transparent'}\`}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[300px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </motion.div>
    </div>
  );
};
`}
      </CodeBlock>
    </div>
  </div>
);
