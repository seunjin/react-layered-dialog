import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/docs/typography';

const openDialogCode = `import { openDialog } from '@/lib/dialogs';

// Alert 열기
openDialog('alert', {
  title: '알림',
  message: '이것은 간단한 알림창입니다.',
});

// Confirm 열기 (Promise 반환)
const confirmed = await openDialog('confirm', {
  title: '확인',
  message: '정말로 진행하시겠습니까?',
});

if (confirmed) {
  console.log('사용자가 확인을 눌렀습니다.');
} else {
  console.log('사용자가 취소를 눌렀습니다.');
}
`;

const closeDialogCode = `import { closeDialog } from '@/lib/dialogs';

// 가장 위에 있는 다이얼로그 닫기
closeDialog();

// 특정 다이얼로그 ID를 지정하여 닫기
// openDialog는 id를 반환합니다.
const dialogId = openDialog('alert', { /* ... */ });
closeDialog(dialogId);
`;

export const OpeningAndClosing = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>Opening & Closing Dialogs</TypographyH2>
      <TypographyP className="mt-2">
        다이얼로그를 열고 닫는 기본적인 방법을 알아봅니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>
        <InlineCode>openDialog</InlineCode>
      </TypographyH3>
      <TypographyP>
        <InlineCode>openDialog</InlineCode> 함수는 다이얼로그를 여는 핵심
        함수입니다. 첫 번째 인자로는 <InlineCode>dialogs.ts</InlineCode>에 정의한
        다이얼로그의 <InlineCode>type</InlineCode>을, 두 번째 인자로는 해당 타입에
        맞는 <InlineCode>props</InlineCode>를 전달합니다.
      </TypographyP>
      <CodeBlock language="typescript" code={openDialogCode} />
      <TypographyP className="mt-4">
        특히 <InlineCode>confirm</InlineCode>과 같이 사용자 상호작용의 결과가
        필요한 다이얼로그의 경우, <InlineCode>openDialog</InlineCode>는{' '}
        <InlineCode>Promise</InlineCode>를 반환합니다. 다이얼로그가 닫힐 때{' '}
        <InlineCode>resolve</InlineCode> 함수에 값을 전달하여 결과를 반환받을 수
        있습니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>
        <InlineCode>closeDialog</InlineCode>
      </TypographyH3>
      <TypographyP>
        <InlineCode>closeDialog</InlineCode> 함수는 다이얼로그를 닫습니다.
        인자 없이 호출하면 현재 열려있는 다이얼로그 중 가장 위에 있는(z-index가
        가장 높은) 다이얼로그를 닫습니다. 특정 다이얼로그를 닫고 싶다면,{' '}
        <InlineCode>openDialog</InlineCode>가 반환하는 <InlineCode>id</InlineCode>
        를 인자로 전달하면 됩니다.
      </TypographyP>
      <CodeBlock language="typescript" code={closeDialogCode} />
    </div>
  </div>
);
