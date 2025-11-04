import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const controllerSignature = `function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
>(): DialogControllerContextValue<TProps, TOptions>;`;

const rendererSignature = `function DialogsRenderer({ store }: { store: DialogStore }): JSX.Element;`;

const controllerExample = `const controller = useDialogController<AlertDialogProps, DialogBehaviorOptions>();
const { close, unmount, setStatus, getStateFields, options } = controller;

const { title, message, onOk } = getStateFields({
  title: props.title,
  message: props.message,
  onOk: props.onOk,
});

const handleOk = async () => {
  setStatus('loading');
  await Promise.resolve(onOk?.());
  setStatus('done');
  close();
  unmount();
};`;

const rendererExample = `import { DialogsRenderer } from 'react-layered-dialog';
import { dialogStore } from '@/lib/dialogs';

export function AppLayout() {
  return (
    <>
      <AppContent />
      <DialogsRenderer store={dialogStore} />
    </>
  );
}`;

export const ControllerRenderer = () => (
  <DocArticle title="useDialogController & DialogsRenderer">
    <p className="lead">
      컨트롤러와 렌더러는 새 스토어 기반 API의 핵심 구성 요소입니다.
      <InlineCode>useDialogController</InlineCode>는 다이얼로그 내부에서 필요한 제어 함수와 상태를 제공하고,
      <InlineCode>DialogsRenderer</InlineCode>는 스토어 스냅샷을 구독해 컴포넌트를 실제 DOM에 출력합니다.
    </p>

    <Section as="h2" id="controller" title="useDialogController">
      <p>
        컨트롤러 훅은 제네릭으로 props/옵션 타입을 지정할 수 있으며,
        <InlineCode>close</InlineCode>, <InlineCode>unmount</InlineCode>, <InlineCode>update</InlineCode>,{' '}
        <InlineCode>setStatus</InlineCode> 등을 포함한 컨텍스트 값을 반환합니다.
      </p>
      <CodeBlock language="ts" code={controllerSignature} />
      <CodeBlock language="ts" code={controllerExample} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>getStateFields</InlineCode>와 <InlineCode>getStateField</InlineCode>를 활용하면
          props와 사용자 정의 상태를 안전하게 병합할 수 있습니다.
        </li>
        <li>
          <InlineCode>stack</InlineCode> 정보(<InlineCode>size</InlineCode>, <InlineCode>index</InlineCode>)를 사용하면
          최상단 여부를 판단할 수 있어 ESC/외부 클릭 로직을 직접 구현하기 쉽습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="renderer" title="DialogsRenderer">
      <p>
        렌더러는 단일 <InlineCode>DialogStore</InlineCode> 인스턴스를 구독하고,
        각 엔트리에 컨트롤러 컨텍스트를 주입한 뒤 등록된 컴포넌트를 렌더링합니다.
        별도의 props 없이 스토어만 전달하면 되므로, 앱 어디에서나 손쉽게 배치할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={rendererSignature} />
      <CodeBlock language="tsx" code={rendererExample} />
      <p className="mt-2 text-sm text-muted-foreground">
        scroll-lock, 포커스 트랩 등 전역 동작은 렌더러에서 직접 구현하거나,
        별도 훅으로 추상화해 조합할 수 있습니다.
      </p>
    </Section>
  </DocArticle>
);
