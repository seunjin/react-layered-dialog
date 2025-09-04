import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Section } from '@/components/docs/Section';

const hookSignature = `function useDialogs(): {
  dialogs: DialogInstance<CustomDialogState>[];
  openDialog: <K extends CustomDialogState['type']>(...) => string;
  closeDialog: (id?: string) => void;
  closeAllDialogs: () => void;
};`;

const usageExample = `import { useDialogs } from '@/lib/dialogs';

const MyComponent = () => {
  // 1. 훅 호출
  const { openDialog, closeDialog } = useDialogs();

  const showAlert = () => {
    // 2. openDialog로 다이얼로그 열기
    openDialog('alert', {
      title: '안녕하세요!',
      message: 'useDialogs 훅을 통해 열렸습니다.',
    });
  };

  return <button onClick={showAlert}>알림창 열기</button>;
};`;

const dialogsPropCode = `// DialogRenderer.tsx
import { useDialogs } from '@/lib/dialogs';

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <>
      {/* 
        'dialogs' 배열을 순회하며 각 다이얼로그에 맞는 
        컴포넌트와 상태(props)를 렌더링합니다.
      */}
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </>
  );
};`;

export const UseDialogsHook = () => (
  <DocArticle title="useDialogs Hook">
    <p className="lead">
      <InlineCode>createUseDialogs</InlineCode>를 통해 생성된, React
      컴포넌트에서 다이얼로그를 제어하기 위한 기본 훅입니다.
    </p>

    <Section as="h2" id="signature" title="Hook Signature">
      <CodeBlock language="typescript" code={hookSignature} />
    </Section>

    <Section as="h2" id="return-value" title="Return Value">
      <div className="not-prose my-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>dialogs</CardTitle>
            <CardDescription>
              현재 열려있는 모든 다이얼로그의 상태 배열입니다. 각 요소는
              렌더링할 <InlineCode>Component</InlineCode>와 해당 컴포넌트에
              전달될 <InlineCode>state</InlineCode>(props)를 포함합니다. 이
              배열은 주로 <InlineCode>DialogRenderer</InlineCode>에서
              사용됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock language="tsx" code={dialogsPropCode} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>openDialog</CardTitle>
            <CardDescription>
              새로운 다이얼로그를 엽니다. 첫 번째 인자로 다이얼로그의{' '}
              <InlineCode>type</InlineCode>을, 두 번째 인자로 해당 다이얼로그
              컴포넌트가 필요로 하는 props를 전달합니다.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>closeDialog</CardTitle>
            <CardDescription>
              다이얼로그를 닫습니다. 인자로 <InlineCode>id</InlineCode>를
              전달하면 특정 다이얼로그를 닫고, 전달하지 않으면 가장 위에 있는
              다이얼로그를 닫습니다.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>closeAllDialogs</CardTitle>
            <CardDescription>
              현재 열려있는 모든 다이얼로그를 한 번에 닫습니다.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Section>

    <Section as="h2" id="usage" title="Usage Example">
      <CodeBlock language="typescript" code={usageExample} />
    </Section>
  </DocArticle>
);