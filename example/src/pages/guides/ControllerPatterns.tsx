import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const controllerBasics = `import { useDialogController } from 'react-layered-dialog';
import type { ConfirmDialogProps, DialogBehaviorOptions } from '@/lib/dialogs';

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const controller = useDialogController<ConfirmDialogProps, DialogBehaviorOptions>();
  const { getStateFields, close, unmount, options, setStatus } = controller;

  const { title, message, onConfirm, onCancel } = getStateFields({
    title: props.title,
    message: props.message,
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
  });

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      await Promise.resolve(onConfirm?.());
      setStatus('done');
    } finally {
      close();
      unmount();
    }
  };

  const handleCancel = () => {
    onCancel?.();
    close();
    unmount();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="rounded-lg bg-white p-6 shadow-xl"
        style={{ zIndex: options.zIndex }}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={handleCancel}>취소</button>
          <button onClick={handleConfirm}>확인</button>
        </div>
      </div>
    </div>
  );
};`;

const manualEscape = `import { useEffect } from 'react';
import { useDialogController } from 'react-layered-dialog';

export function useEscapeToClose(enabled: boolean) {
  const { close, stack } = useDialogController();

  useEffect(() => {
    if (!enabled || stack.index !== stack.size - 1) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close, enabled, stack.index, stack.size]);
}`;

const outsideClick = `import { useEffect, useRef } from 'react';
import { useDialogController } from 'react-layered-dialog';

export function useOutsideClickToClose<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const { close, stack } = useDialogController();

  useEffect(() => {
    if (stack.index !== stack.size - 1) return;

    const handleClick = (event: MouseEvent) => {
      const node = containerRef.current;
      if (node && !node.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [close, stack.index, stack.size]);

  return containerRef;
}`;

export const ControllerPatterns = () => (
  <DocArticle title="컨트롤러 활용 패턴">
    <p className="lead">
      새 API에서는 <InlineCode>useDialogController</InlineCode>가 모든 제어 함수를 제공합니다.
      ESC, 외부 클릭, 비동기 상태 관리 등 대부분의 동작을 컨트롤러 조합만으로 구현할 수 있습니다.
      아래 예제들은 공통 패턴을 보여주며, 필요에 따라 조합해 사용할 수 있습니다.
    </p>

    <Section as="h2" id="basic" title="1. 컨트롤러 기본 사용">
      <p>
        컨트롤러는 props와 옵션을 안전하게 병합할 수 있도록{' '}
        <InlineCode>getStateFields</InlineCode> 헬퍼를 제공합니다. 또한{' '}
        <InlineCode>close</InlineCode>, <InlineCode>unmount</InlineCode>, <InlineCode>setStatus</InlineCode> 등
        스택을 제어하는 메서드를 직접 노출합니다.
      </p>
      <CodeBlock language="tsx" code={controllerBasics} />
    </Section>

    <Section as="h2" id="escape" title="2. ESC 키로 닫기">
      <p>
        최상단 다이얼로그에서만 ESC를 처리하려면 컨트롤러의 <InlineCode>stack</InlineCode> 정보를 확인하세요.
        아래 훅은 필요한 다이얼로그에서 호출만 해도 ESC 동작을 구현할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={manualEscape} />
    </Section>

    <Section as="h2" id="outside-click" title="3. 외부 클릭 대응">
      <p>
        컨트롤러는 닫기 함수만 제공하고, 실제 이벤트 리스너는 애플리케이션 책임입니다.
        외부 클릭 감지 역시 간단한 훅으로 구현할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={outsideClick} />
    </Section>

    <Section as="h2" id="tips" title="4. 추가 팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <b>Stack 정보 활용</b>: <InlineCode>stack.size</InlineCode>와 <InlineCode>stack.index</InlineCode>를 활용하면
          중첩 다이얼로그의 우선순위를 쉽게 제어할 수 있습니다.
        </li>
        <li>
          <b>옵션 기본값</b>: 컨트롤러는 다이얼로그 열 때 전달한 옵션을 그대로 노출합니다.
          기본값을 지정하고 싶다면 <InlineCode>DialogStore</InlineCode> 호출부나 컴포넌트 내부에서 병합하세요.
        </li>
        <li>
          <b>비동기 흐름</b>: <InlineCode>openAsync</InlineCode>의 결과 객체와 컨트롤러를 함께 사용하면
          로딩 상태, 결과 처리, 후속 애니메이션을 일관되게 구성할 수 있습니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
