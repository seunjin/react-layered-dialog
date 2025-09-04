import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';

const updateDialogCode = `import { openDialog, updateDialog } from '@/lib/dialogs';

const showLoadingDialog = () => {
  // 로딩 다이얼로그를 열고 ID를 저장합니다.
  const dialogId = openDialog('alert', {
    title: '로딩 중...',
    message: '데이터를 불러오고 있습니다.',
  });

  // 2초 후에 업데이트 함수를 호출하여 내용을 변경합니다.
  setTimeout(() => {
    updateDialog(dialogId, {
      title: '로딩 완료',
      message: '데이터를 성공적으로 불러왔습니다.',
    });
  }, 2000);
};
`;

const internalStateCode = `import { useState } from 'react';
import { closeDialog } from '@/lib/dialogs';
// ... other imports

export const FormDialog = ({ zIndex, id }: FormDialogProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      setError('값을 입력해주세요.');
      return;
    }
    // 입력값을 resolve 함수에 담아 다이얼로그를 닫습니다.
    closeDialog(id, { submittedValue: inputValue });
  };

  // ... JSX ...
}
`;

export const StateManagement = () => (
  <DocArticle title="State Management">
    <p className="lead">
      이미 열려있는 다이얼로그의 상태를 업데이트하거나, 다이얼로그 컴포넌트
      자체적으로 내부 상태를 관리하는 방법을 알아봅니다.
    </p>

    <Section as="h2" id="update-dialog" title="updateDialog: 외부에서 상태 업데이트">
      <p>
        <InlineCode>updateDialog</InlineCode> 함수를 사용하면 다이얼로그를 연
        컴포넌트 외부에서도 특정 다이얼로그의 상태(
        <InlineCode>props</InlineCode>)를 동적으로 변경할 수 있습니다. 예를
        들어, 비동기 작업의 진행 상태를 표시하는 데 유용합니다.
      </p>
      <CodeBlock language="typescript" code={updateDialogCode} />
    </Section>

    <Section as="h2" id="internal-state" title="다이얼로그 내부 상태 관리">
      <p>
        복잡한 상호작용이 필요한 다이얼로그(예: 폼 입력)는 자체적으로 내부
        상태를 가질 수 있습니다. React의 <InlineCode>useState</InlineCode>나{' '}
        <InlineCode>useReducer</InlineCode>와 같은 훅을 사용하여 컴포넌트 내부
        상태를 자유롭게 관리하고, 최종 결과물만{' '}
        <InlineCode>closeDialog</InlineCode>
        의 두 번째 인자로 전달하여 반환할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={internalStateCode} />
    </Section>
  </DocArticle>
);