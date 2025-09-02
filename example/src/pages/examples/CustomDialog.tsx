import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import { TypographyH2, TypographyP } from '@/components/ui/typography';

export const CustomDialog = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>커스텀 다이얼로그: Modal</TypographyH2>
      <TypographyP>
        <InlineCode>Modal</InlineCode> 컴포넌트는{' '}
        <InlineCode>children</InlineCode> prop을 통해 어떤 React 컴포넌트든
        내부에 렌더링할 수 있는 유연성을 제공합니다. 이를 통해 복잡한 폼이나
        사용자 정의 UI를 다이얼로그로 손쉽게 만들 수 있습니다.
      </TypographyP>
    </div>

    <div>
      <TypographyP>
        <strong>Modal.tsx</strong>
      </TypographyP>
      <CodeBlock
        language="tsx"
        code={`import { useEffect } from 'react';
import { useDialogs } from '@/lib/dialogs';
import type { ModalState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type ModalProps = DialogState<ModalState>;

export const Modal = ({ 
  children,
  zIndex,
  dimmed = true,
  closeOnOverlayClick = true,
  dismissable = true,
}: ModalProps) => {
  const { dialogs, closeDialog } = useDialogs();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopDialog = 
        dialogs.length > 0 && 
        dialogs[dialogs.length - 1].state.zIndex === zIndex;
      if (event.key === 'Escape' && dismissable && isTopDialog) {
        closeDialog();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissable, closeDialog, dialogs, zIndex]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      closeDialog();
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
        className="relative rounded-lg bg-white p-6 shadow-lg min-w-[400px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" onClick={() => closeDialog()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};
`}
      />
    </div>
  </div>
);
