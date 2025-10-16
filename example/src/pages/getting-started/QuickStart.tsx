import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { UsageToggleContainer } from '@/components/demos/UsageToggleContainer';
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';
import alertComponentCode from '@/code-templates/AlertBasic.tsx.txt?raw';
import dialogRendererCode from '@/code-templates/DialogRenderer.tsx.txt?raw';
import appTsxCode from '@/code-templates/App.tsx.txt?raw';
import usageCode from '@/code-templates/usage.tsx.txt?raw';

export const QuickStart = () => (
  <DocArticle title="Quick Start">
    <p className="lead">
      세 파일만으로 다이얼로그 스택을 구성해봅니다. 코어는 상태만 관리하고 UI는
      전적으로 개발자가 구성합니다.
    </p>

    <Section as="h2" id="define" title="1. 다이얼로그 시스템 정의">
      <p>
        <InlineCode>src/lib/dialogs.ts</InlineCode> 파일에서 다이얼로그 유니온,
        매니저, 훅을 한 번에 정의합니다. 이 파일은 애플리케이션 어디에서든
        재사용됩니다.
      </p>
      <p>
        다이얼로그 유니온에서 가장 중요한 규칙은 각 분기에{' '}
        <InlineCode>type</InlineCode> 필드를 명시하는 것입니다. 이 값이
        렌더러가 어떤 컴포넌트와 연결되어야 하는지를 결정하고, 동시에
        TypeScript가 상태를 안전하게 좁힐 수 있도록 하는 식별자 역할을 합니다.
      </p>
      <p>
        <InlineCode>createDialogManager&lt;AppDialogState&gt;</InlineCode>는 이
        필드를 기반으로 <InlineCode>openDialog</InlineCode>나
        <InlineCode>updateDialog</InlineCode> 호출 시 올바른 분기를 선택하도록
        강제합니다. 예를 들어{' '}
        <InlineCode>openDialog(&#123; type: &apos;alert&apos;, ...&#125;)</InlineCode>를
        호출하면 <InlineCode>alert</InlineCode> 상태에 필요한 속성만 입력하도록
        편집기에서 즉시 피드백을 받을 수 있습니다. 또한
        <InlineCode>Extract</InlineCode>를 이용해{' '}
        <InlineCode>AlertDialogState</InlineCode> 같은 파생 타입을 만들면,
        훅과 컴포넌트 전반에서 동일한 모델을 재사용할 수 있습니다.
      </p>
      <p>
        <InlineCode>type</InlineCode> 외의 필드는 전적으로 사용하는 다이얼로그에
        맞춰 자유롭게 설계하면 됩니다. 제목, 버튼 콜백, 폼 입력값 등 UI에
        필요한 데이터를 원하는 형태로 추가하고, 각 분기는 서로 다른 속성 집합을
        가져도 무방합니다.
      </p>
      <p>
        예제에서는 각 상태를 <InlineCode>BaseState</InlineCode>와 교차시켜
        선언합니다. 이렇게 하면 <InlineCode>dismissable</InlineCode>,
        <InlineCode>closeOnOutsideClick</InlineCode>,
        <InlineCode>dimmed</InlineCode> 같은 공통 동작 플래그를 한 번에 재사용하면서
        필요할 때만 오버라이드할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
    </Section>

    <Section as="h2" id="component" title="2. 다이얼로그 컴포넌트 작성">
      <p>
        상태 유니온에 맞춰 실제 UI를 구현합니다. 여기서는 간단한 알림 창 예제를
        사용합니다.
      </p>
      <CodeBlock language="tsx" code={alertComponentCode} />
    </Section>

    <Section as="h2" id="renderer" title="3. 렌더러와 진입점 구성">
      <p>
        <InlineCode>DialogRenderer</InlineCode>는 열린 다이얼로그 배열을
        순회하며 컴포넌트를 렌더링하는 얇은 프리미티브입니다. 앱 최상단에 배치해
        다이얼로그를 어디서든 표시할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={dialogRendererCode} />
      <CodeBlock language="tsx" code={appTsxCode} />
    </Section>

    <Section as="h2" id="open" title="4. 다이얼로그 열기">
      <p>
        훅이 반환하는 <InlineCode>openDialog</InlineCode> 함수를 사용하거나,
        매니저 메서드를 직접 호출해 어느 곳에서든 다이얼로그를 열 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={usageCode} />
      <p className="mt-2 text-sm text-muted-foreground">
        더 많은 패턴은 <InlineCode>Guides</InlineCode> 섹션에서 확인하세요. ESC,
        포커스 트랩 등을 원한다면 <InlineCode>useLayerBehavior</InlineCode>{' '}
        애드온을 조합할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="live-demo" title="실시간 데모">
      <p>
        아래 버튼을 눌러 방금 작성한 설정이 어떻게 작동하는지 바로 확인해
        보세요. 코드는 그대로 복사하여 프로젝트에 붙여 넣을 수 있습니다.
      </p>
      <UsageToggleContainer
        title="기본 다이얼로그 흐름"
        description="스위치를 사용해 애니메이션 유무를 비교하면서 Alert, Confirm, Modal을 실행해 볼 수 있습니다."
      />
      <p className="mt-4 text-sm text-muted-foreground">
        기본값은 예제 앱에 포함된 Plain 다이얼로그 타입(
        <InlineCode>plain-alert</InlineCode> 등)을 사용합니다. Quick Start
        코드와 동일한 Motion 구현이 필요하면 토글을 켜서 확인하세요. 더 많은
        변형 예제는 <InlineCode>Examples → Live Showcase</InlineCode> 페이지에서
        보실 수 있습니다.
      </p>
    </Section>
  </DocArticle>
);
