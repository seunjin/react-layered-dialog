import { Button } from '@/components/ui/button';
import { useDialogs } from '@/lib/dialogs';
import { CodeBlock } from '@/components/docs/CodeBlock';

/**
 * 중첩 다이얼로그 제어 흐름을 직접 체험할 수 있는 간단한 컨트롤 패널입니다.
 * `openDialog`와 `closeDialog` 조합만으로 스택을 어떻게 관리하는지 보여주기 위해
 * DemoCard와 같은 추가 레이아웃 없이 독립적인 섹션으로 구성했습니다.
 */
export const LayeredStackDemo = () => {
  const { openDialog, closeDialog, closeAllDialogs } = useDialogs();
  const snippet = `const { openDialog, closeDialog, closeAllDialogs } = useDialogs();

const openControlPanel = () => {
  openDialog('modal', {
    title: '중첩 제어 패널',
    body: (
      <>
        <Button
          onClick={() =>
            openDialog('modal', {
              title: '중첩된 모달',
              body: (
                <Button onClick={closeAllDialogs}>
                  모든 다이얼로그 닫기
                </Button>
              ),
            })
          }
        >
          중첩 모달 열기
        </Button>
        <Button variant="outline" onClick={() => closeDialog()}>
          제어 패널 닫기
        </Button>
      </>
    ),
  });
};`;

  const openNestedModal = () =>
    openDialog('modal', {
      title: '중첩된 모달',
      description: '현재 컨트롤 패널 위에 또 하나의 모달이 열린 상태입니다.',
      body: (
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>이 레이어는 독립적으로 닫거나 전체 스택을 정리할 수 있습니다.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => closeDialog()}>
              이 모달 닫기
            </Button>
            <Button variant="outline" onClick={closeAllDialogs}>
              모든 레이어 닫기
            </Button>
          </div>
        </div>
      ),
    });

  const openControlPanel = () =>
    openDialog('modal', {
      title: '중첩 제어 패널',
      description:
        '이 패널에서 추가 모달을 열어 스택이 어떻게 쌓이고 정리되는지 확인해 보세요.',
      body: (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            `openDialog`를 여러 번 호출해도 스택 상단부터 차례대로 닫히므로 복잡한
            흐름도 선언적으로 관리할 수 있습니다.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={openNestedModal}>중첩 모달 열기</Button>
            <Button variant="outline" onClick={() => closeDialog()}>
              제어 패널 닫기
            </Button>
          </div>
        </div>
      ),
    });

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">
        아래 버튼을 눌러 제어 패널을 열고, 패널 안에서 추가 모달을 띄워 보세요.
        스택이 쌓이고 정리되는 과정을 직접 확인할 수 있습니다.
      </p>
      <Button onClick={openControlPanel}>중첩 제어 패널 열기</Button>
      <div>
        <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          openDialog 구조 예시
        </p>
        <CodeBlock language="tsx" code={snippet} />
      </div>
    </div>
  );
};
