import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from '@/components/docs/typography';

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
    dialogs: dialogs,
    zIndex: props.zIndex,

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

const optionsData = [
  {
    name: 'dialogs',
    default: 'Required',
    type: "readonly { state: { zIndex?: number } }[]",
    description: '훅이 최상단 레이어를 식별하기 위해 z-index를 계산하는 데 사용하는 다이얼로그 상태 배열입니다.',
  },
  {
    name: 'zIndex',
    default: 'undefined',
    type: 'number',
    description: '현재 동작을 적용할 레이어의 z-index입니다. 훅은 이 값을 `dialogs` 배열로부터 계산된 최상단 z-index와 비교합니다.',
  },
  {
    name: 'closeOnEscape',
    default: 'false',
    type: 'boolean',
    description: 'Escape 키로 레이어를 닫는 동작을 활성화합니다.',
  },
  {
    name: 'onEscape',
    default: 'undefined',
    type: '() => void',
    description: '`closeOnEscape`가 true일 때, Escape 키를 누르면 실행될 콜백 함수입니다.',
  },
  {
    name: 'autoFocus',
    default: 'false',
    type: 'boolean',
    description: '레이어 마운트 시 자동 포커스 동작을 활성화합니다.',
  },
  {
    name: 'focusRef',
    default: 'undefined',
    type: 'React.RefObject<HTMLElement | null>',
    description: '`autoFocus`가 true일 때, 포커스를 받을 요소의 ref 객체입니다.',
  },
  {
    name: 'closeOnOutsideClick',
    default: 'false',
    type: 'boolean',
    description: '레이어 외부 클릭 시 닫는 동작을 활성화합니다.',
  },
  {
    name: 'onOutsideClick',
    default: 'undefined',
    type: '() => void',
    description: '`closeOnOutsideClick`가 true일 때, 외부를 클릭하면 실행될 콜백 함수입니다.',
  },
  {
    name: 'outsideClickRef',
    default: 'undefined',
    type: 'React.RefObject<Element | null>',
    description: '외부 클릭을 감지할 기준 요소의 ref 객체입니다.',
  },
];

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
      <div className="flex flex-col gap-6 rounded-lg border p-4">
        {optionsData.map((opt) => (
          <div key={opt.name} className="border-b pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-4">
              <h4 className="font-mono font-bold text-lg">{opt.name}</h4>
              {opt.default === 'Required' ? (
                <span className="text-xs font-semibold text-destructive border border-destructive px-2 py-1 rounded-full">
                  Required
                </span>
              ) : (
                <span className="text-xs font-semibold text-muted-foreground">
                  optional
                </span>
              )}
            </div>
            <div className="font-mono text-sm text-muted-foreground mt-2 break-all">
              {opt.type}
            </div>
            {opt.default !== 'Required' && (
              <div className="text-sm mt-2">
                <strong>Default:</strong> <InlineCode>{opt.default}</InlineCode>
              </div>
            )}
            <p className="text-sm mt-2">{opt.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <TypographyH3>Usage Example</TypographyH3>
      <CodeBlock language="tsx" code={usageExample} />
    </div>
  </div>
);
