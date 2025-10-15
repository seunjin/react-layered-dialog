import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `useLayerBehavior({
  id,
  dialogs,
  zIndex,
  closeOnEscape,
  onEscape,
  closeOnOutsideClick,
  onOutsideClick,
  outsideClickRef,
}: {
  id?: string;
  dialogs: readonly { state: { zIndex?: number } }[];
  zIndex?: number;
  closeOnEscape?: boolean;
  onEscape?: () => void;
  closeOnOutsideClick?: boolean;
  onOutsideClick?: () => void;
  outsideClickRef?: React.RefObject<Element | null>;
}): void;`;

const example = `const panelRef = useRef<HTMLDivElement>(null);
const { dialogs, closeDialog } = useDialogs();

useLayerBehavior({
  id,
  dialogs,
  zIndex,
  closeOnEscape: true,
  onEscape: () => closeDialog(id),
  closeOnOutsideClick: true,
  onOutsideClick: () => closeDialog(id),
  outsideClickRef: panelRef,
});`;

export const UseLayerBehavior = () => (
  <DocArticle title="useLayerBehavior">
    <p className="lead">
      포커스, ESC, 오버레이 클릭 등의 상호작용을 한 번에 처리하는 보조 훅입니다.
      코어 API와는 별개이므로 필요할 때만 사용하세요.
    </p>

    <Section as="h2" id="signature" title="시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="parameters" title="매개변수">
      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">dialogs</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            현재 열린 다이얼로그 배열입니다. 최상단 여부를 계산하기 위해 필요합니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">zIndex</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            현재 다이얼로그의 z-index. 최상단인지 비교하기 위해 사용합니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">closeOnEscape / onEscape</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            ESC 키 처리 여부와 콜백입니다. 최상단 다이얼로그일 때만 트리거됩니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">closeOnOutsideClick / outsideClickRef</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            ref 영역 밖에서 클릭이 발생했을 때 <InlineCode>onOutsideClick</InlineCode>을 호출합니다.
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">
        포커스 이동은 라이브러리가 대신 처리하지 않습니다. 필요한 경우 다이얼로그 컴포넌트 내부에서{' '}
        <InlineCode>useEffect</InlineCode> 등을 활용해 원하는 요소에 <InlineCode>focus()</InlineCode>를 호출하세요.
      </p>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="tsx" code={example} />
    </Section>
  </DocArticle>
);
