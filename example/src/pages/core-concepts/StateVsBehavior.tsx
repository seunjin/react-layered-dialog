import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from '@/components/docs/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const propsAndHookExample = `// 👍 상태와 동작이 분리된 방식

// 1. "상태"는 openDialog에 전달
openDialog('alert', {
  title: '저장 완료',
  message: '성공적으로 저장되었습니다.',
});

// 2. "동작"은 컴포넌트 내부에서 훅으로 정의
// Alert.tsx 내부
useLayerBehavior({
  closeOnEscape: props.dismissable,
  autoFocus: true,
  // ...
});`;

export const StateVsBehavior = () => (
  <div className="space-y-8">
    <div>
      <TypographyH1>State vs. Behavior</TypographyH1>
      <TypographyLead>
        라이브러리의 핵심 설계 원칙: 상태(State)와 동작(Behavior)의 분리
      </TypographyLead>
      <TypographyP className="mt-4">
        UI 컴포넌트를 설계할 때 흔히 겪는 어려움은 컴포넌트의 데이터(State)와
        사용자 인터랙션에 따른 반응(Behavior)이 하나의 코드 덩어리에 섞이는
        것입니다. <InlineCode>React Layered Dialog</InlineCode>는 이 두 가지를
        명확하게 분리하여 유연성과 재사용성을 극대화하는 것을 핵심 아키텍처로
        삼습니다.
      </TypographyP>
    </div>

    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>자동차 대시보드 비유</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TypographyP>
            이 개념을 자동차에 비유해볼 수 있습니다.
          </TypographyP>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>상태 (Props):</strong> 운전자가 조작하는 대시보드의 버튼이나
              스위치입니다. &quot;스포츠 모드 켜기&quot;(`sportsMode: true`)나 &quot;비상등
              켜기&quot;(`emergencyLight: true`)와 같이, 운전자는{' '}
              <strong>무엇을 원하는지(의도)</strong>만 선언적으로 설정합니다.
            </li>
            <li>
              <strong>동작 (Hook):</strong> &quot;스포츠 모드&quot; 버튼을 눌렀을 때, 엔진의
              연료 분사량을 조절하고 서스펜션을 제어하는 등, 실제로 복잡한 일을
              수행하는 내부의 <strong>엔진과 소프트웨어</strong>입니다.
            </li>
          </ul>
          <TypographyP>
            운전자는 엔진의 내부 동작을 알 필요 없이 버튼만 누르면 됩니다. 우리
            라이브러리도 마찬가지입니다.
          </TypographyP>
        </CardContent>
      </Card>
    </div>

    <div>
      <TypographyH2>라이브러리 아키텍처</TypographyH2>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <TypographyH3>1. 상태와 설정 (Props)</TypographyH3>
          </CardHeader>
          <CardContent>
            <TypographyP>
              <InlineCode>BaseLayerProps</InlineCode>와 이를 확장하는 각 다이얼로그의
              State 인터페이스(`AlertState` 등)는 &quot;대시보드 버튼&quot; 역할을 합니다.
              이들은 다이얼로그가 어떤 데이터를 표시해야 하는지(`title`, `message`),
              그리고 어떤 동작을 허용할지(`dismissable`, `closeOnOverlayClick`)를
              결정하는 <strong>선언적인 설정값</strong>입니다.
            </TypographyP>
            <TypographyP className="mt-2">
              이 설정값들은 <InlineCode>openDialog</InlineCode> 함수를 통해
              전달됩니다.
            </TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <TypographyH3>2. 동작의 구현 (Hook)</TypographyH3>
          </CardHeader>
          <CardContent>
            <TypographyP>
              <InlineCode>useLayerBehavior</InlineCode> 훅은 &quot;엔진&quot; 역할을 합니다.
              이 훅은 <InlineCode>BaseLayerProps</InlineCode>로 전달된 설정값을
              받아서, <InlineCode>useEffect</InlineCode>를 통해 DOM 이벤트를
              처리하고 포커스를 관리하는 등, 복잡하고 <strong>명령적인 로직</strong>을 실제로
              구현합니다.
            </TypographyP>
            <TypographyP className="mt-2">
              이 로직은 각 다이얼로그 컴포넌트 내부에 캡슐화되어, 사용자는 훅의
              존재를 신경 쓸 필요가 없습니다.
            </TypographyP>
          </CardContent>
        </Card>
      </div>
    </div>

    <div>
      <TypographyH2>이점</TypographyH2>
      <TypographyP className="mt-4">
        이러한 분리 덕분에 다음과 같은 장점을 얻습니다.
      </TypographyP>
      <ul className="mt-4 list-disc pl-6 space-y-2">
        <li>
          <strong>관심사 분리 (SoC):</strong> 상태는 순수한 데이터 객체로 관리되어
          디버깅과 예측이 쉬워집니다. 동작 로직은 훅에 캡슐화되어 재사용성이
          높아집니다.
        </li>
        <li>
          <strong>높은 범용성:</strong> <InlineCode>useLayerBehavior</InlineCode>라는
          범용 엔진이 있으므로, 우리는 `Modal`, `Alert` 뿐만 아니라 `Toast`,
          `Drawer`, `ContextMenu` 등 어떤 종류의 레이어 컴포넌트든 동일한 동작
          규칙을 적용하여 쉽게 만들 수 있습니다.
        </li>
        <li>
          <strong>명확한 API:</strong> 라이브러리 사용자는 <InlineCode>openDialog</InlineCode>
          에 상태와 설정을 전달하는 것만 신경 쓰면 되므로, API가 훨씬 단순하고
          명확해집니다.
        </li>
      </ul>
      <CodeBlock language="typescript" code={propsAndHookExample} className="mt-4" />
    </div>
  </div>
);
