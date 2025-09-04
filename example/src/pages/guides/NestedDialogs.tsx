import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';

const nestedDialogCode = `import { openDialog } from '@/lib/dialogs';

const openNestedDialogs = async () => {
  // 첫 번째 Confirm 다이얼로그 열기
  const confirmedFirst = await openDialog('confirm', {
    title: '첫 번째 확인',
    message: '첫 번째 단계를 진행하시겠습니까?',
  });

  if (confirmedFirst) {
    // 사용자가 첫 번째를 확인하면, 두 번째 Alert 다이얼로그 열기
    openDialog('alert', {
      title: '첫 번째 단계 완료',
      message: '이제 두 번째 단계를 시작합니다.',
    });

    // 이어서 바로 세 번째 다이얼로그를 열 수도 있습니다.
    // 라이브러리가 z-index를 자동으로 관리하여 올바른 순서로 표시됩니다.
    const confirmedSecond = await openDialog('confirm', {
        title: '두 번째 확인',
        message: '두 번째 단계를 진행하시겠습니까?',
    });

    if(confirmedSecond) {
        // ...
    }
  }
};
`;

export const NestedDialogs = () => (
  <DocArticle title="Nested Dialogs">
    <p className="lead">
      다이얼로그 내부에서 또 다른 다이얼로그를 여는 중첩 호출(Nesting)은
      사용자 플로우를 안내하는 데 유용합니다.
    </p>
    <p>
      <InlineCode>react-layered-dialog</InlineCode>는{' '}
      <InlineCode>z-index</InlineCode>를 자동으로 관리하므로, 개발자는 복잡한
      순서 관리 없이 필요한 시점에 <InlineCode>openDialog</InlineCode>를
      호출하기만 하면 됩니다. 라이브러리는 내부적으로{' '}
      <InlineCode>baseZIndex</InlineCode>(기본값 1000)부터 시작하여
      다이얼로그가 열릴 때마다 z-index를 1씩 증가시킵니다.
    </p>

    <CodeBlock language="typescript" code={nestedDialogCode} />

    <div className="not-prose my-6 rounded-lg border bg-muted/30 p-4 text-center">
      <p className="text-lg font-semibold">[중첩 다이얼로그 시각화 이미지]</p>
      <p className="mt-2 text-sm text-muted-foreground">
        다이얼로그가 순서대로 쌓여있는 모습을 보여주는 이미지 (z-index: 1000,
        1001, 1002...)
      </p>
    </div>
  </DocArticle>
);