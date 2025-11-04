import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const optionsUsageSnippet = `import { useEffect, useRef } from 'react';
import { useDialogController } from 'react-layered-dialog';
import type { DialogBehaviorOptions, ModalDialogProps } from '@/lib/dialogs';

export function ModalDialog(props: ModalDialogProps) {
  const controller = useDialogController<ModalDialogProps, DialogBehaviorOptions>();
  const { getStateFields, options, stack, close, unmount } = controller;
  const { title, description, onClose } = getStateFields(props);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options.closeOnOutsideClick === false) return;
    const handlePointer = (event: MouseEvent) => {
      if (!panelRef.current || !panelRef.current.contains(event.target as Node)) {
        onClose?.();
        close();
        unmount();
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [options.closeOnOutsideClick, close, unmount, onClose]);

  useEffect(() => {
    if (options.closeOnEscape === false) return;
    if (stack.index !== stack.size - 1) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        close();
        unmount();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [options.closeOnEscape, stack.index, stack.size, close, unmount, onClose]);

  return (
    <div role="dialog" aria-modal="true" ref={panelRef}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <button onClick={() => { onClose?.(); close(); unmount(); }}>닫기</button>
    </div>
  );
}`;

const optionPresetSnippet = `const dialog = createDialogApi(new DialogStore(), {
  alert: { component: Alert, options: { closeOnEscape: true, scrollLock: true } },
  modal: {
    component: ModalDialog,
    options: { closeOnEscape: true, closeOnOutsideClick: false, scrollLock: true },
  },
});`;

export const BehaviorOptionsPage = () => (
  <DocArticle title="옵션 & 커스텀 동작">
    <p className="lead">
      <InlineCode>DialogBehaviorOptions</InlineCode>처럼 정의한 옵션은 컨트롤러와 렌더러에서 행동을 제어하는 데 활용됩니다.
      가장 상위 컴포넌트에서 전역 동작을 구현하거나 레지스트리에서 기본 옵션을 지정해 일관된 경험을 제공하세요.
    </p>

    <Section as="h2" id="component" title="컴포넌트에서 옵션 활용">
      <CodeBlock language="tsx" code={optionsUsageSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>stack.index</InlineCode>/<InlineCode>stack.size</InlineCode>로 최상단 여부를 확인해 ESC 처리 등을 안전하게 제한합니다.
        </li>
        <li>
          옵션이 비활성화된 경우(<InlineCode>false</InlineCode>)엔 이벤트 리스너를 등록하지 않도록 분기해 불필요한 비용을 줄이세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="defaults" title="레지스트리에서 기본 옵션 지정">
      <CodeBlock language="ts" code={optionPresetSnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        레지스트리의 <InlineCode>options</InlineCode> 필드에 값을 지정하면 컨트롤러의 <InlineCode>options</InlineCode>에서 동일한 값이 제공됩니다.
        상황에 따라 호출부가 옵션을 덮어쓸 수도 있습니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          scroll lock 같은 전역 동작은 렌더러에서 감지해 적용하고, 옵션 값을 기준으로 토글하면 재사용이 쉽습니다.
        </li>
        <li>
          옵션이 많아질 경우 <InlineCode>Partial&lt;DialogBehaviorOptions&gt;</InlineCode> 형태로 받아서 기본값을 병합하는 패턴을 사용하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="관련 문서">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          기본 구현 패턴은 <InlineCode>컴포넌트 기본기</InlineCode>에서 다시 확인할 수 있습니다.
        </li>
        <li>
          비동기 흐름과 상태 업데이트는 <InlineCode>비동기 패턴</InlineCode> 문서를 참고하세요.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
