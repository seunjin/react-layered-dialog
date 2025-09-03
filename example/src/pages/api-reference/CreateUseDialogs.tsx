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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const functionSignature = `function createUseDialogs<T>(
  manager: DialogManager<T>,
  componentMap: ComponentMap<T>
): () => useDialogsReturnType;`;

const usageExample = `// src/lib/dialogs.ts

import { createUseDialogs } from 'react-layered-dialog';
import { manager } from './manager'; // createDialogManager에서 생성된 인스턴스
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

// 1. 컴포넌트 맵 생성
//    키: 다이얼로그 type 문자열
//    값: 렌더링할 React 컴포넌트
const componentMap = {
  alert: Alert,
  confirm: Confirm,
};

// 2. useDialogs 훅 생성
export const useDialogs = createUseDialogs(manager, componentMap);
`;

const componentMapCode = `// ComponentMap<T>의 개념적인 타입 구조
type ComponentMap<CustomDialogState> = {
  [K in CustomDialogState['type']]: React.ComponentType<DialogState<Extract<CustomDialogState, { type: K }>>>;
};

// 실제 사용 예시
const componentMap = {
  alert: Alert,       // Alert 컴포넌트는 DialogState<AlertState>를 props로 받음
  confirm: Confirm,   // Confirm 컴포넌트는 DialogState<ConfirmState>를 props로 받음
};`;

export const CreateUseDialogs = () => (
  <DocArticle>
    <h1>createUseDialogs</h1>
    <p className="lead">
      <InlineCode>DialogManager</InlineCode>의 상태를 React 컴포넌트와
      연결하는 <InlineCode>useDialogs</InlineCode> 훅을 생성합니다.
    </p>
    <p>
      이 팩토리 함수는 순수 TypeScript로 작성된 <InlineCode>DialogManager</InlineCode>
      와 React의 렌더링 시스템을 연결하는 다리 역할을 합니다. 여기서 생성된{' '}
      <InlineCode>useDialogs</InlineCode> 훅을 통해 컴포넌트는 다이얼로그의
      상태 변화를 구독하고, 다이얼로그를 열거나 닫는 함수를 사용할 수 있게
      됩니다.
    </p>

    <h2>Function Signature</h2>
    <CodeBlock language="typescript" code={functionSignature} />

    <h2>Parameters</h2>
    <div className="space-y-4 my-6">
      <Card>
        <CardHeader>
          <CardTitle>manager</CardTitle>
          <CardDescription>
            <InlineCode>createDialogManager</InlineCode>를 통해 생성된{' '}
            <InlineCode>DialogManager</InlineCode> 인스턴스입니다.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>componentMap</CardTitle>
          <CardDescription>
            다이얼로그의 <InlineCode>type</InlineCode> 문자열을 실제 렌더링될
            React 컴포넌트와 매핑하는 객체입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Type Safety</AlertTitle>
            <AlertDescription>
              TypeScript는 이 <InlineCode>componentMap</InlineCode>을 분석하여{' '}
              <InlineCode>openDialog(&apos;alert&apos;, ...)</InlineCode> 호출 시{' '}
              <InlineCode>Alert</InlineCode> 컴포넌트에 필요한 props 타입을
              정확하게 추론합니다.
            </AlertDescription>
          </Alert>
          <CodeBlock
            language="typescript"
            code={componentMapCode}
            className="mt-4"
          />
        </CardContent>
      </Card>
    </div>

    <h2>Return Value</h2>
    <p>
      앱 전체에서 다이얼로그 상태를 구독하고 제어하는 데 사용될{' '}
      <InlineCode>useDialogs</InlineCode> 훅을 반환합니다.
    </p>

    <h2>Usage Example</h2>
    <CodeBlock language="typescript" code={usageExample} />
  </DocArticle>
);
