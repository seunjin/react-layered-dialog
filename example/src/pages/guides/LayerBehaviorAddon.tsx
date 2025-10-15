import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DemoCard } from '@/components/docs/DemoCard';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';

const usageSnippet = `import { useLayerBehavior } from 'react-layered-dialog';
import type { DialogInstance } from 'react-layered-dialog';

export const AlertDialog = ({
  id,
  zIndex,
  message,
  dialogs,
  closeDialog,
}: DialogInstance<{ type: 'alert'; message: string }>['state'] & {
  dialogs: readonly DialogInstance<{ type: 'alert' }>[];
  closeDialog: (id: string) => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape: true,
    onEscape: () => closeDialog(id),
    closeOnOutsideClick: true,
    onOutsideClick: () => closeDialog(id),
    outsideClickRef: panelRef,
  });

  return (
    <div style={{ zIndex }}>
      <div ref={panelRef}>{message}</div>
    </div>
  );
};`;

export const LayerBehaviorAddon = () => (
  <DocArticle title="useLayerBehavior 애드온">
    <p className="lead">
      <InlineCode>useLayerBehavior</InlineCode>는 키보드/오버레이 동작을 빠르게
      구현하도록 돕는 선택 기능입니다. 코어에 강제되지 않으므로 필요할 때만
      조합하세요.
    </p>

    <Section as="h2" id="when" title="언제 사용하나요?">
      <ul className="ml-6 list-disc space-y-2">
        <li>ESC 키로 최상단 다이얼로그를 닫고 싶을 때</li>
        <li>오버레이 바깥 클릭을 감지해야 할 때</li>
        <li>다이얼로그가 열릴 때 특정 요소에 자동 포커스를 주고 싶을 때</li>
      </ul>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <p>
        훅에 필요 데이터를 명시적으로 전달해야 합니다. 특히 현재 열린 다이얼로그
        배열과 <InlineCode>zIndex</InlineCode>를 함께 줘야 최상단 여부를 판단할
        수 있습니다.
      </p>
      <CodeBlock language="tsx" code={usageSnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        훅은 단순히 document 이벤트를 구독하고 정리(clean-up)합니다. 자체적으로
        state를 수정하지 않으므로, 닫기 동작은 직접 호출해야 합니다.
      </p>
    </Section>

    <Section as="h2" id="alternatives" title="직접 구현하기">
      <p>
        프로젝트 요구사항이 다르다면 ESC/포커스/오버레이 로직을 직접 작성해도
        됩니다. 코어는 특정 구현에 얽매이지 않도록 설계되어 있으며,{' '}
        <InlineCode>useLayerBehavior</InlineCode>는 단지 빠른 출발을 돕는
        레퍼런스일 뿐입니다.
      </p>
    </Section>

    <Section as="h2" id="demo" title="실시간 예제">
      <p>
        ESC, 바깥 클릭, 중첩 다이얼로그를 모두 체험해볼 수 있는 작은
        제어판입니다. 모달을 열고 다양한 동작을 확인해 보세요.
      </p>
      <DemoCard title="Layer Behavior 데모">
        <AdvancedFeaturesDemo />
      </DemoCard>
    </Section>
  </DocArticle>
);
