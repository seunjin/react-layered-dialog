import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InteractiveConfirmDemo } from '@/components/demos/InteractiveConfirmDemo';

const usageSnippet = `import { useRef } from 'react';
import { useLayerBehavior } from 'react-layered-dialog';
import { useDialogs } from '@/lib/dialogs';
import type { ConfirmDialogProps } from '@/lib/dialogs';

export function ConfirmDialog({
  id,
  zIndex,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  message,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { dialogs, closeDialog } = useDialogs();

  useLayerBehavior({
    id,
    dialogs,
    zIndex,
    closeOnEscape,
    onEscape: () => closeDialog(id),
    closeOnOutsideClick,
    onOutsideClick: () => closeDialog(id),
    outsideClickRef: panelRef,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div ref={panelRef} className="rounded-lg bg-white p-6 shadow-xl">
        <p>{message}</p>
        <button onClick={() => closeDialog(id)}>확인</button>
      </div>
    </div>
  );
}`;

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

    <Section as="h2" id="usage" title="핵심 사용법">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          다이얼로그 컴포넌트 내부에서 <InlineCode>panelRef</InlineCode>와 같이
          닫기 동작을 제어할 루트 요소를 준비합니다.
        </li>
        <li>
          <InlineCode>useDialogs</InlineCode>로 현재 열린 다이얼로그 배열과{' '}
          <InlineCode>closeDialog</InlineCode> 함수를 가져옵니다.
        </li>
        <li>
          <InlineCode>useLayerBehavior</InlineCode>에{' '}
          <InlineCode>id</InlineCode>, <InlineCode>dialogs</InlineCode>,{' '}
          <InlineCode>zIndex</InlineCode>를 넘기고, 필요한 동작만 명시적으로
          활성화합니다.
        </li>
      </ol>
      <CodeBlock language="tsx" code={usageSnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        훅은 단순히 document 이벤트를 구독하고 정리(clean-up)합니다. 자체적으로
        state를 수정하지 않으므로, 닫기 동작은 직접 호출해야 합니다.
      </p>
    </Section>

    <Section as="h2" id="options" title="주요 옵션 정리">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>closeOnEscape</InlineCode> (기본값 <InlineCode>false</InlineCode>):{' '}
          최상단 다이얼로그일 때 ESC 키로 닫히도록 설정합니다. 닫힐 때 실행할
          로직은 <InlineCode>onEscape</InlineCode>에 작성하세요.
        </li>
        <li>
          <InlineCode>closeOnOutsideClick</InlineCode> (기본값 <InlineCode>false</InlineCode>):{' '}
          모달 바깥을 클릭했을 때 닫히도록 설정합니다.{' '}
          <InlineCode>outsideClickRef</InlineCode>로 경계 요소를 지정해야 합니다.
        </li>
        <li>
          <InlineCode>outsideClickRef</InlineCode>:{' '}
          <InlineCode>closeOnOutsideClick</InlineCode>가 활성화된 경우 필수입니다.
          클릭을 허용할 루트 요소의 ref를 넘기면, 그 외부 영역 클릭 시{' '}
          <InlineCode>onOutsideClick</InlineCode>가 호출됩니다.
        </li>
        <li>
          <InlineCode>dialogs</InlineCode>, <InlineCode>zIndex</InlineCode>:{' '}
          현재 열린 다이얼로그 배열과 해당 레이어의 z-index는 항상 넘겨야 합니다.
          훅 내부에서 최상단 여부를 판단하는 기준 값이 됩니다.
        </li>
      </ul>
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
      <p className="text-sm text-muted-foreground">
        아래 버튼을 눌러 모달을 열고 ESC·바깥 클릭·중첩 다이얼로그가 어떻게
        동작하는지 확인해 보세요. 이 데모 역시{' '}
        <InlineCode>useLayerBehavior</InlineCode> 하나로 동작을 구성했습니다.
      </p>
      <InteractiveConfirmDemo />
    </Section>
  </DocArticle>
);
