import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const optionsUsageSnippet = `import { useEffect, useRef } from 'react';
import { useDialogController } from 'react-layered-dialog';

type ModalDialogProps = {
  title: string;
  description?: string;
  onClose?: () => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
};

export function ModalDialog(props: ModalDialogProps) {
  const controller = useDialogController<ModalDialogProps>();
  const { getStateFields, stack, close, unmount } = controller;
  const { title, description, onClose, closeOnEscape, closeOnOutsideClick } = getStateFields({
    title: props.title,
    description: props.description,
    onClose: props.onClose,
    closeOnEscape: props.closeOnEscape ?? true,
    closeOnOutsideClick: props.closeOnOutsideClick ?? true,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!closeOnOutsideClick) return;
    const handlePointer = (event: MouseEvent) => {
      if (!panelRef.current || !panelRef.current.contains(event.target as Node)) {
        onClose?.();
        close();
        unmount();
      }
    };
    document.addEventListener('mousedown', handlePointer);
    return () => document.removeEventListener('mousedown', handlePointer);
  }, [closeOnOutsideClick, close, unmount, onClose]);

  useEffect(() => {
    if (!closeOnEscape || stack.index !== stack.size - 1) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        close();
        unmount();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeOnEscape, stack.index, stack.size, close, unmount, onClose]);

  return (
    <div role="dialog" aria-modal="true" ref={panelRef}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <button onClick={() => { onClose?.(); close(); unmount(); }}>닫기</button>
    </div>
  );
}`;

export const BehaviorOptionsPage = () => (
  <DocArticle title="동작 플래그 & 커스텀 동작">
    <p className="lead">
      ESC, 외부 클릭, scroll-lock처럼 UX를 좌우하는 동작은 모두 다이얼로그 props에 포함시키고
      <InlineCode>getStateFields</InlineCode>로 기본값을 병합해 사용합니다.
      필요하다면 커스텀 훅을 만들어 전역 동작을 조합하세요.
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

    <Section as="h2" id="defaults" title="기본값과 전역 훅">
      <p>
        props에서 기본값을 지정한 뒤 <InlineCode>getStateFields</InlineCode>에 동일한 구조를 전달하면,
        <InlineCode>update</InlineCode> 이후에도 안정적으로 동작 플래그를 유지할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        scroll-lock처럼 전역 DOM을 제어해야 한다면 <InlineCode>useBodyScrollLock</InlineCode> 같은 훅으로
        클래스를 토글하고, 전역 CSS에 <InlineCode>overflow: hidden;</InlineCode> 규칙을 등록하세요.
      </p>
    </Section>

    <Section as="h2" id="tips" title="팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          scroll lock 같은 전역 동작은 렌더러보다 컴포넌트 레벨 훅에서 제어하는 편이 예측 가능합니다.
        </li>
        <li>
          플래그가 많아질 경우 <InlineCode>Partial&lt;ModalDialogProps&gt;</InlineCode>처럼
          부분 타입을 받아 기본값을 병합하세요.
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
