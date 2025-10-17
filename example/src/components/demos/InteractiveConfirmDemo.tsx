import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';
import { CodeBlock } from '@/components/docs/CodeBlock';

type ConfirmOptions = {
  dimmed: boolean;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
  scrollLock: boolean;
};

const buildSnippet = ({
  dimmed,
  closeOnEscape,
  closeOnOutsideClick,
  scrollLock,
}: ConfirmOptions) => {
  const lines = [
    "const handle = openDialog('confirm', {",
    "  title: '삭제 확인',",
    "  message: '이 작업은 되돌릴 수 없습니다.',",
  ];

  if (!dimmed) lines.push('  dimmed: false,');
  if (!closeOnEscape) lines.push('  closeOnEscape: false,');
  if (!closeOnOutsideClick) lines.push('  closeOnOutsideClick: false,');
  if (!scrollLock) lines.push('  scrollLock: false,');

  lines.push(
    '  onConfirm: () => {',
    '    closeDialog(handle.id);',
    '  },',
    '});'
  );

  return lines.join('\n');
};

export const InteractiveConfirmDemo = () => {
  const { openDialog, closeDialog } = useDialogs();
  const [dimmed, setDimmed] = useState(true);
  const [closeOnEscape, setCloseOnEscape] = useState(true);
  const [closeOnOutsideClick, setCloseOnOutsideClick] = useState(true);
  const [scrollLock, setScrollLock] = useState(true);

  const snippet = useMemo(
    () =>
      buildSnippet({
        dimmed,
        closeOnEscape,
        closeOnOutsideClick,
        scrollLock,
      }),
    [dimmed, closeOnEscape, closeOnOutsideClick, scrollLock]
  );

  const handleOpenConfirm = () => {
    const handle = openDialog('confirm', {
      title: '삭제 확인',
      message: '이 작업은 되돌릴 수 없습니다.',
      dimmed,
      closeOnEscape,
      closeOnOutsideClick,
      scrollLock,
      onConfirm: () => {
        closeDialog(handle.id);
      },
      onCancel: () => {
        closeDialog(handle.id);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border p-4">
        <div className="space-y-2">
          <div>
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={dimmed}
                onChange={(event) => setDimmed(event.currentTarget.checked)}
              />
              dimmed (배경 어둡게)
            </label>
            <p className="pl-6 text-sm text-muted-foreground">
              해제하면 배경 dim 없이 확인창만 표시됩니다.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={closeOnEscape}
                onChange={(event) => setCloseOnEscape(event.currentTarget.checked)}
              />
              closeOnEscape (ESC로 닫기)
            </label>
            <p className="pl-6 text-sm text-muted-foreground">
              끄면 ESC 키로 닫히지 않습니다.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={closeOnOutsideClick}
                onChange={(event) =>
                  setCloseOnOutsideClick(event.currentTarget.checked)
                }
              />
              closeOnOutsideClick (바깥 클릭 허용)
            </label>
            <p className="pl-6 text-sm text-muted-foreground">
              끄면 다이얼로그 외부를 클릭해도 닫히지 않습니다.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={scrollLock}
                onChange={(event) => setScrollLock(event.currentTarget.checked)}
              />
              scrollLock (배경 스크롤 잠금)
            </label>
            <p className="pl-6 text-sm text-muted-foreground">
              끄면 다이얼로그가 열려 있어도 배경 스크롤이 허용됩니다.
            </p>
          </div>

          <Button onClick={handleOpenConfirm}>확인 다이얼로그 열기</Button>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          생성되는 openDialog 호출
        </p>
        <CodeBlock language="tsx" code={snippet} />
      </div>
    </div>
  );
};
