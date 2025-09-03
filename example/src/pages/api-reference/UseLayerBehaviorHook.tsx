import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from '@/components/ui/typography';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const hookSignature = `function useLayerBehavior(options: UseLayerBehaviorOptions): void;`;

const usageExample = `// 예시: Confirm.tsx 컴포넌트 내부
import { useLayerBehavior } from 'react-layered-dialog';
import { useDialogs } from '@/lib/dialogs';

export const Confirm = (props: ConfirmProps) => {
  const { dialogs, closeDialog } = useDialogs();
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleCancel = () => closeDialog(props.id);

  useLayerBehavior({
    // 현재 레이어 정보
    zIndex: props.zIndex,
    getTopZIndex: () => dialogs.at(-1)?.state?.zIndex,

    // 동작 활성화 및 콜백 연결
    closeOnEscape: props.dismissable,
    onEscape: handleCancel,
    
    autoFocus: true,
    focusRef: confirmButtonRef,

    closeOnOutsideClick: props.closeOnOverlayClick,
    onOutsideClick: handleCancel,
    outsideClickRef: panelRef,
  });

  return (
    <div ref={panelRef}>
      {/* ... */}
    </div>
  );
};`;

export const UseLayerBehaviorHook = () => (
  <div className="space-y-12">
    <div>
      <TypographyH2>useLayerBehavior Hook</TypographyH2>
      <TypographyLead>
        레이어 컴포넌트의 공통 동작(behavior)을 캡슐화하고 주입하는 훅입니다.
      </TypographyLead>
      <TypographyP className="mt-4">
        이 훅은 다이얼로그, 모달, 드로어 등과 같은 레이어 컴포넌트 내부에서
        사용되어야 합니다. <InlineCode>BaseLayerProps</InlineCode>를 통해 전달된
        선언적 설정을 받아, 실제 DOM 이벤트를 처리하는 복잡한 로직을 수행합니다.
        이를 통해 상태와 동작의 관심사를 분리합니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>Hook Signature</TypographyH3>
      <CodeBlock language="typescript" code={hookSignature} />
    </div>

    <div className="space-y-4">
      <TypographyH3>Options (UseLayerBehaviorOptions)</TypographyH3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Option</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-mono">zIndex</TableCell>
            <TableCell className="font-mono">number</TableCell>
            <TableCell>
              동작을 적용할 레이어의 z-index. 최상단 여부 판단에 사용됩니다.
            </TableCell>
            <TableCell>
              <InlineCode>undefined</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">getTopZIndex</TableCell>
            <TableCell className="font-mono">
              () ={'>'} number | undefined
            </TableCell>
            <TableCell>
              가장 높은 z-index 값을 반환하는 콜백 함수입니다.
            </TableCell>
            <TableCell className="font-mono text-destructive">Required</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">closeOnEscape</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>
              Escape 키로 레이어를 닫는 동작을 활성화합니다.
            </TableCell>
            <TableCell>
              <InlineCode>false</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">onEscape</TableCell>
            <TableCell className="font-mono">() ={'>'} void</TableCell>
            <TableCell>
              <InlineCode>closeOnEscape</InlineCode>가 true일 때, Escape 키를
              누르면 실행될 콜백 함수입니다.
            </TableCell>
            <TableCell>
              <InlineCode>undefined</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">autoFocus</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>
              레이어 마운트 시 자동 포커스 동작을 활성화합니다.
            </TableCell>
            <TableCell>
              <InlineCode>false</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">focusRef</TableCell>
            <TableCell className="font-mono">RefObject</TableCell>
            <TableCell>
              <InlineCode>autoFocus</InlineCode>가 true일 때, 포커스를 받을
              요소의 ref 객체입니다.
            </TableCell>
            <TableCell>
              <InlineCode>undefined</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">closeOnOutsideClick</TableCell>
            <TableCell className="font-mono">boolean</TableCell>
            <TableCell>
              레이어 외부 클릭 시 닫는 동작을 활성화합니다.
            </TableCell>
            <TableCell>
              <InlineCode>false</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">onOutsideClick</TableCell>
            <TableCell className="font-mono">() ={'>'} void</TableCell>
            <TableCell>
              <InlineCode>closeOnOutsideClick</InlineCode>가 true일 때, 외부를
              클릭하면 실행될 콜백 함수입니다.
            </TableCell>
            <TableCell>
              <InlineCode>undefined</InlineCode>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-mono">outsideClickRef</TableCell>
            <TableCell className="font-mono">RefObject</TableCell>
            <TableCell>
              외부 클릭을 감지할 기준 요소의 ref 객체입니다.
            </TableCell>
            <TableCell>
              <InlineCode>undefined</InlineCode>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div>
      <TypographyH3>Usage Example</TypographyH3>
      <CodeBlock language="tsx" code={usageExample} />
    </div>
  </div>
);
