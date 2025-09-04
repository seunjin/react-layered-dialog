import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Section } from '@/components/docs/Section';

const beforeExample = `// MyPage.tsx
function MyPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');

  function handleSave() {
    // ... 저장 로직 ...
    setAlertTitle('저장 완료');
    setIsAlertOpen(true);
  }

  return (
    <div>
      <button onClick={handleSave}>저장</button>
      
      {/* 다이얼로그의 상태와 렌더링이 부모 컴포넌트에 묶여있음 */}
      <Alert
        isOpen={isAlertOpen}
        title={alertTitle}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
}`;

const afterExample = `// MyPage.tsx
import { useDialogs } from 'react-layered-dialog';

function MyPage() {
  const { openDialog } = useDialogs();

  function handleSave() {
    // ... 저장 로직 ...

    // "어떤 다이얼로그를, 어떤 내용으로 열어줘" 라는 '명령'만 전달
    openDialog('alert', {
      title: '저장 완료',
      message: '성공적으로 저장되었습니다.',
    });
  }

  return <button onClick={handleSave}>저장</button>;
}

// DialogRenderer는 앱 최상단에 한 번만 선언하면 됩니다.
 function App() {
   return (
     <>
       {/* ... other components */}
       <DialogRenderer />
     </>
   )
 }
`;

const implementationExample = `// 1. 다이얼로그 열기 (상태와 설정 전달)
// 사용자는 '어떻게' 동작할지 고민할 필요 없이
// '무엇을' 보여줄지와 '어떤 정책'으로 동작할지만 전달합니다.
function handleClick() {
  openDialog('alert', {
    title: '저장 완료',
    message: '성공적으로 저장되었습니다.',
    // 정책: 이 다이얼로그는 외부 클릭으로 닫히지 않음
    dismissable: false, 
  });
}

// 2. Alert 다이얼로그 컴포넌트 구현 (동작 정의)
// 내부에선 useLayerBehavior 훅을 사용해 동작을 실제로 구현합니다.
// props로 전달된 '정책(dismissable)'을 훅에 연결합니다.
const Alert = (props: AlertProps) => {
  const { close } = useDialogUtils();
  
  useLayerBehavior({
    // dismissable prop에 따라 ESC 키 동작이 결정됩니다.
    closeOnEscape: props.dismissable,
    // 외부 클릭 동작도 여기서 제어됩니다.
    closeOnOutsideClick: props.dismissable,
    autoFocus: true,
  });

  return (
    <div role="alertdialog">
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      <button onClick={() => close('alert')}>확인</button>
    </div>
  );
};`;

export const StateVsBehavior = () => (
  <DocArticle title="State vs. Behavior">
    <Section as="h2" id="problem" title="“어디서든 여는 다이얼로그”의 어려움">
      <p className="lead">다이얼로그 관리는 왜 항상 번거로울까요?</p>
      <p>
        React 애플리케이션에서 다이얼로그를 관리하는 것은 종종 까다로운 일이
        됩니다. 일반적으로 <InlineCode>useState</InlineCode>를 사용하여
        다이얼로그의 가시성을 제어하고, 필요한 데이터와 핸들러를{' '}
        <InlineCode>props</InlineCode>로 전달해야 합니다. 이 방식은 몇 가지
        흔한 문제점을 야기합니다.
      </p>
      <CodeBlock language="typescript" code={beforeExample} />
      <ul>
        <li>
          <strong>상태 관리의 복잡성:</strong> 모든 다이얼로그마다{' '}
          <InlineCode>isOpen</InlineCode> 상태와 관련 데이터(
          <InlineCode>title</InlineCode>, <InlineCode>message</InlineCode>{' '}
          등)를 부모 컴포넌트에서 관리해야 합니다.
        </li>
        <li>
          <strong>강한 결합도:</strong> 다이얼로그의 렌더링 로직이 특정
          컴포넌트에 종속되어, 다른 곳에서 재사용하기 어렵습니다.
        </li>
        <li>
          <strong>Props Drilling:</strong> 다이얼로그를 여는 트리거가 깊은
          곳에 있다면, 상태와 핸들러를 여러 계층의 컴포넌트를 통해 전달해야
          합니다.
        </li>
      </ul>
    </Section>

    <Section
      as="h2"
      id="solution"
      title="해결책: 명령형 API와 선언적 컴포넌트의 조화"
    >
      <p className="lead">
        &quot;어디서든, 무엇이든&quot; 열 수 있는 유연한 접근법
      </p>
      <p>
        <InlineCode>React Layered Dialog</InlineCode>는 이 문제를 해결하기
        위해 접근 방식을 바꿉니다. 더 이상 부모 컴포넌트가 다이얼로그의
        생명주기를 일일이 관리할 필요가 없습니다. 대신, 필요한 곳 어디서든{' '}
        <InlineCode>openDialog</InlineCode> 함수를 호출하여 &quot;어떤
        다이얼로그를 어떤 내용으로 열어달라&quot;고 명령하기만 하면 됩니다.
      </p>
      <CodeBlock language="typescript" code={afterExample} />
      <p>
        이전 예시의 모든 보일러플레이트 코드가 사라지고, 오직 다이얼로그를
        여는 &apos;의도&apos;만이 코드에 남았습니다. 어떻게 이것이 가능할까요?
      </p>
    </Section>

    <Section
      as="h2"
      id="core-principle"
      title="핵심 원리: 상태(State)와 동작(Behavior)의 분리"
    >
      <p>
        이 라이브러리의 마법은 &apos;상태&apos;와 &apos;동작&apos;을 명확히
        분리하는 설계에서 비롯됩니다.
      </p>
      <div className="not-prose my-6 space-y-4">
        <Alert>
          <div>
            <AlertTitle>상태 (State)</AlertTitle>
            <AlertDescription>
              <strong>&quot;무엇을&quot;</strong> 보여줄지에 대한 정보입니다.
              다이얼로그의 <InlineCode>title</InlineCode>,{' '}
              <InlineCode>message</InlineCode> 와 같은 정적인 데이터나,{' '}
              <InlineCode>dismissable: false</InlineCode> 와 같이 동작 방식을
              결정하는 &apos;설정&apos; 또는 &apos;정책&apos;이 여기에 해당합니다. 이들은
              모두 <InlineCode>openDialog</InlineCode>를 통해 순수한 객체
              형태로 전달됩니다.
            </AlertDescription>
          </div>
        </Alert>
        <Alert>
          <div>
            <AlertTitle>동작 (Behavior)</AlertTitle>
            <AlertDescription>
              <strong>&quot;어떻게&quot;</strong> 상호작용할지에 대한 실제
              구현입니다. ESC 키를 누르면 닫히거나, 외부를 클릭했을 때의 반응,
              포커스 관리 등 복잡한 Side Effect과 생명주기 관리를 의미합니다.
              이 모든 로직은 <InlineCode>useLayerBehavior</InlineCode> 훅에
              캡슐화되어 다이얼로그 컴포넌트 내부에서 처리됩니다.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </Section>

    <Section as="h2" id="benefits" title="실제 코드와 그로 인한 이점">
      <p>
        이러한 분리 원칙이 실제 코드에서 어떻게 적용되고, 어떤 이점을
        가져다주는지 살펴보겠습니다.
      </p>
      <CodeBlock language="typescript" code={implementationExample} />
      <div className="not-prose my-6 space-y-4">
        <Alert>
          <div>
            <AlertTitle>관심사 분리 (SoC)</AlertTitle>
            <AlertDescription>
              컴포넌트는 더 이상 다이얼로그의 열림/닫힘 상태를 알 필요가
              없습니다. 오직 다이얼로그를 여는 &apos;명령&apos;만 내리면 되므로,
              컴포넌트의 책임이 명확해지고 코드가 단순해집니다.
            </AlertDescription>
          </div>
        </Alert>
        <Alert>
          <div>
            <AlertTitle>높은 범용성</AlertTitle>
            <AlertDescription>
              동작 로직이 훅으로 분리되었기 때문에, `Modal`, `Alert` 뿐만
              아니라 `Toast`, `Drawer`, `ContextMenu` 등 어떤 종류의 레이어
              컴포넌트든 동일한 동작 규칙을 적용하여 쉽게 만들 수 있습니다.
            </AlertDescription>
          </div>
        </Alert>
        <Alert>
          <div>
            <AlertTitle>명확하고 간결한 API</AlertTitle>
            <AlertDescription>
              복잡한 로직이 추상화되었기 때문에, 사용자는{' '}
              <InlineCode>openDialog</InlineCode>에 필요한 상태와 설정을
              전달하는 것만 신경 쓰면 됩니다. 이는 API를 훨씬 이해하기 쉽고
              사용하기 쉽게 만듭니다.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </Section>
  </DocArticle>
);
