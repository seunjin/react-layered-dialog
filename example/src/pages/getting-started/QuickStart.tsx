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
