import {
  TypographyH2,
  TypographyP,
} from '@/components/ui/typography';
import type { ReactNode } from 'react';

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
    <code>{children}</code>
  </pre>
);

export const RenderingLayer = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>렌더링 레이어: DialogRenderer.tsx</TypographyH2>
      <TypographyP>
        `DialogRenderer`는 `useDialogs` 훅을 통해 관리되는 다이얼로그 상태 배열을 구독하고, 실제 DOM에 렌더링하는 역할을 담당합니다. 이 컴포넌트는 앱의 최상위 레이아웃에 한 번만 포함되면 됩니다.
      </TypographyP>
    </div>

    <div>
      <CodeBlock>
{`import { AnimatePresence } from 'motion/react';
import type { SomeDialogInstance } from 'react-layered-dialog';
import type { CustomDialogState } from '@/lib/dialogs';
import { useDialogs } from '@/lib/dialogs';

import { Alert } from './Alert';
import { Confirm } from './Confirm';
import { Modal } from './Modal';

interface DialogComponentProps {
  dialog: SomeDialogInstance<CustomDialogState>;
}

const DialogComponent = ({ dialog }: DialogComponentProps) => {
  switch (dialog.state.type) {
    case 'alert':
      return <Alert {...dialog.state} />;
    case 'confirm':
      return <Confirm {...dialog.state} />;
    case 'modal':
      return <Modal {...dialog.state} />;
    default:
      return null;
  }
};

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <AnimatePresence>
      {dialogs.map((dialog) => (
        <DialogComponent key={dialog.state.id} dialog={dialog} />
      ))}
    </AnimatePresence>
  );
};`}
      </CodeBlock>
    </div>
  </div>
);
