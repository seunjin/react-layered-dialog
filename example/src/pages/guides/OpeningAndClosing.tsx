import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const useDialogsCode = `import { useDialogs } from '@/lib/dialogs';

function MyComponent() {
  const { openDialog } = useDialogs();

  const showAlert = () => {
    // 첫 번째 인자로 type, 두 번째 인자로 props 전달
    openDialog('alert', {
      title: '알림',
      message: '이것은 React 컴포넌트에서 여는 알림창입니다.',
    });
  };

  return <button onClick={showAlert}>알림 열기</button>
}
`;

const managerCode = `import { openDialog } from '@/lib/dialogs';
import axios from 'axios';

export async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    // React와 무관한 로직에서도 다이얼로그 호출 가능
    // state 객체에 type을 직접 명시
    openDialog({
      type: 'alert',
      title: '오류',
      message: '데이터 로딩 중 문제가 발생했습니다.',
    });
  }
}
`;

const factoryExplanationCode = `// factory.ts (라이브러리 내부 코드 예시)
export function createDialogManager() {
  // 1. 상태(State)를 함수 스코프 내의 변수로 관리 (this가 아님)
  let dialogs = [];
  const subscribers = new Set();

  // 2. 내부 함수들은 자신이 선언된 스코프의 변수(dialogs)에 접근
  const openDialog = (state) => {
    // 이 함수는 'this'를 사용하지 않음
    // 대신 클로저를 통해 'dialogs' 변수에 직접 접근
    dialogs = [...dialogs, { ...state }];
    subscribers.forEach(callback => callback());
  };

  const closeDialog = () => { /* ... */ };

  // 3. 'this'를 사용하지 않는 함수들을 객체로 반환
  return { openDialog, closeDialog, /* ... */ };
}

// 사용부 (dialogs.ts)
const { manager } = createDialogManager();

// 따라서 아래와 같이 분리해서 export 해도 안전합니다.
export const openDialog = manager.openDialog;
`;

const closeDialogCode = `import { closeDialog, closeAllDialogs } from '@/lib/dialogs';

// 가장 위에 있는 다이얼로그 닫기
closeDialog();

// 특정 다이얼로그 ID를 지정하여 닫기
const dialogId = openDialog({ type: 'alert', /* ... */ });
closeDialog(dialogId);

// 모든 다이얼로그 한 번에 닫기
closeAllDialogs();
`;

export const OpeningAndClosing = () => (
  <DocArticle title="Opening & Closing Dialogs">
    <p className="lead">
      다이얼로그를 열고 닫는 두 가지 방법과 각각의 사용 사례, 그리고 그 동작
      원리에 대해 알아봅니다.
    </p>

    <Section as="h2" id="ways-to-open" title="다이얼로그를 여는 두 가지 방법">
      <p>
        라이브러리는 다이얼로그를 여는 두 가지 방법을 제공합니다. 어떤 방법을
        사용할지는 다이얼로그를 어디서 호출하는지에 따라 달라집니다.
      </p>
      <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
        <li>
          <b>
            <InlineCode>useDialogs()</InlineCode> 훅 (권장)
          </b>
          : React 컴포넌트 내에서 사용할 때 가장 편리하고 타입 안전성이 높은
          방법입니다.
        </li>
        <li>
          <b>
            <InlineCode>openDialog</InlineCode> 직접 import
          </b>
          : React 컴포넌트 외부의 유틸리티 함수나 API 로직 등에서 사용할 때
          필요한 방법입니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="use-dialogs-hook" title="1. useDialogs() 훅 사용하기 (권장)">
      <p>
        React 컴포넌트 안에서 다이얼로그를 열 때는{' '}
        <InlineCode>useDialogs</InlineCode> 훅을 사용하는 것이 가장 좋습니다.
        이 방법은 타입스크립트의 강력한 타입 추론을 지원하여 개발 경험을
        향상시킵니다.
      </p>
      <CodeBlock language="tsx" code={useDialogsCode} />
      <p>
        <InlineCode>openDialog</InlineCode> 함수의 첫 번째 인자로 다이얼로그의{' '}
        <InlineCode>type</InlineCode>을, 두 번째 인자로는 해당 타입에 맞는{' '}
        <InlineCode>props</InlineCode> 객체를 전달합니다. 타입 추론 덕분에 두
        번째 인자에 잘못된 <InlineCode>props</InlineCode>를 전달하면 즉시 에러를
        알 수 있습니다.
      </p>
    </Section>

    <Section
      as="h2"
      id="direct-import"
      title="2. openDialog 직접 Import하여 사용하기"
    >
      <p>
        가끔은 React 컴포넌트와 관련 없는 곳에서 다이얼로그를 열어야 할 때가
        있습니다. 예를 들어, API 요청 실패 시 공통 에러 메시지를 띄우는 경우가
        대표적입니다. React 훅은 컴포넌트 내에서만 호출할 수 있으므로, 이런
        상황에서는 <InlineCode>dialogs.ts</InlineCode>에서 직접{' '}
        <InlineCode>openDialog</InlineCode> 함수를 import하여 사용합니다.
      </p>
      <CodeBlock language="typescript" code={managerCode} />
      <p>
        이 함수는 훅에서 제공하는 함수와 달리 **하나의 객체**를 인자로 받습니다.
        이 객체 안에는 <InlineCode>type</InlineCode>을 반드시 포함해야 합니다.
      </p>
    </Section>

    <Section as="h2" id="how-it-works" title="동작 원리: 팩토리 함수와 클로저">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Deep Dive</AlertTitle>
        <AlertDescription>
          <p>
            &quot;왜 <InlineCode>manager.openDialog</InlineCode>를 분리해서{' '}
            <InlineCode>export</InlineCode>
            해도 괜찮을까요?&quot; 클래스(class) 기반의 객체였다면 메서드를 분리할 때{' '}
            <InlineCode>this</InlineCode> 컨텍스트를 잃어버리는 문제가 발생할 수
            있습니다.
          </p>
          <p className="mt-2">
            이 라이브러리는 **팩토리 함수**와 **클로저** 패턴을 사용하여 이
            문제를 해결합니다. <InlineCode>createDialogManager</InlineCode>는
            클래스가 아닌 함수이며, 내부 상태(예: 다이얼로그 목록)를{' '}
            <InlineCode>this</InlineCode>가 아닌 지역 변수로 관리합니다.
          </p>
        </AlertDescription>
      </Alert>
      <CodeBlock language="typescript" code={factoryExplanationCode} />
      <p>
        <InlineCode>openDialog</InlineCode>와 같은 내부 함수들은 자신이 생성된
        환경(스코프)을 기억하는 클로저의 특성 덕분에, <InlineCode>this</InlineCode>{' '}
        없이도 상위 스코프의 <InlineCode>dialogs</InlineCode> 변수에 안전하게
        접근할 수 있습니다. 따라서 이 함수들을 객체에서 분리하여{' '}
        <InlineCode>export</InlineCode>해도 원래의 상태를 잃어버리지 않고
        정상적으로 동작합니다. 이러한 설계 덕분에 React의 생명주기와 분리된
        곳에서도 다이얼로그를 제어하는 유연성을 확보할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="closing-dialogs" title="다이얼로그 닫기">
      <p>
        다이얼로그를 닫을 때는 <InlineCode>closeDialog</InlineCode> 또는{' '}
        <InlineCode>closeAllDialogs</InlineCode> 함수를 사용합니다. 이 함수들은
        컴포넌트 내부/외부 어디서든 동일하게 사용할 수 있습니다.
      </p>
      <CodeBlock language="typescript" code={closeDialogCode} />
      <p>
        <InlineCode>closeDialog</InlineCode>를 인자 없이 호출하면 가장 위에 있는
        다이얼로그가 닫힙니다. 특정 다이얼로그를 닫고 싶다면,{' '}
        <InlineCode>openDialog</InlineCode>가 반환하는{' '}
        <InlineCode>id</InlineCode>를 인자로 전달하면 됩니다.
      </p>
    </Section>
  </DocArticle>
);