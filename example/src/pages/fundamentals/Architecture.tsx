import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';
import dialogRendererCode from '@/code-templates/DialogRendererMinimal.tsx.txt?raw';

export const Architecture = () => (
  <DocArticle title="Architecture Overview">
    <p className="lead">
      React Layered Dialog는 단일 <InlineCode>DialogStore</InlineCode>를 중심으로 동작하며,
      나머지 요소는 얇은 계층으로 조합하는 구조를 지향합니다. 코어는 스택과 상태만
      책임지고, 실제 UI·동작은 애플리케이션이 직접 구성합니다.
    </p>

    <Section as="h2" id="components" title="Components Overview">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>DialogStore</b>: 다이얼로그 엔트리 배열과 z-index, 메타 상태를 보관합니다.
          <InlineCode>open</InlineCode>, <InlineCode>close</InlineCode>,{' '}
          <InlineCode>update</InlineCode> 같은 저수준 메서드를 제공합니다.
        </li>
        <li>
          <b>createDialogApi</b> (선택): 스토어와 레지스트리를 연결해 <InlineCode>dialog.open</InlineCode>,
          <InlineCode>dialog.alert</InlineCode>처럼 재사용할 헬퍼를 만들어 줍니다.
        </li>
        <li>
          <b>DialogsRenderer</b>: 스토어 스냅샷을 구독해 실제 React 컴포넌트를 렌더링합니다.
          애플리케이션은 이 위에 scroll lock, 레이어 애니메이션 같은 정책을 자유롭게 추가합니다.
        </li>
        <li>
          <b>useDialogController</b>: 다이얼로그 컴포넌트 내부에서 close/update/stack 정보를
          제공하는 훅입니다. UI와 상호작용을 한 곳에서 제어할 수 있게 합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="flow" title="Interaction Flow">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          애플리케이션이 <InlineCode>DialogStore</InlineCode> 인스턴스를 생성합니다. 필요하면{' '}
          <InlineCode>createDialogApi</InlineCode>로 헬퍼 객체를 만듭니다.
        </li>
        <li>
          루트에서 <InlineCode>DialogsRenderer</InlineCode>를 배치해 스토어 스냅샷을 구독합니다.
        </li>
        <li>
          다이얼로그 컴포넌트는 <InlineCode>useDialogController</InlineCode>를 사용해 닫기, 상태
          업데이트, 스택 정보를 받아 UI와 상호작용을 정의합니다.
        </li>
        <li>
          임의의 위치에서 <InlineCode>dialog.open(() =&gt; &lt;Alert /&gt;)</InlineCode>{' '}
          (또는 스토어 직접 사용 시 <InlineCode>dialogStore.open(...)</InlineCode>), 레지스트리 기반이면{' '}
          <InlineCode>dialog.alert({`{ title, message }`})</InlineCode>처럼 호출하면 스토어가 새 엔트리를
          추가하고 렌더러가 이를 즉시 반영합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="principles" title="Design Principles">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>스토어는 가장 얇게</b>: 스택과 z-index 계산, 비동기 settle만 담당합니다. 렌더링·스타일링은
          전적으로 애플리케이션 몫입니다.
        </li>
        <li>
          <b>타입-구동 레지스트리</b>: 레지스트리에 컴포넌트를 등록하면 메서드 시그니처가 자동으로 매핑돼
          호출 시점부터 타입 안전성을 확보합니다.
        </li>
        <li>
          <b>컨트롤러 중심 컴포넌트</b>: 렌더러와 컨트롤러가 Context로 연결되기 때문에, 다이얼로그 내부에서는
          props/옵션/스택 정보를 일관된 API로 다룰 수 있습니다.
        </li>
        <li>
          <b>옵션형 전역 동작</b>: scroll lock, 접근성, 포커스 트랩 같은 정책은 필요할 때만 opt-in 하도록
          설계돼 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="reference-code" title="Reference Snippets">
      <p>
        Quick Start 문서에서는 Alert 한 가지를 기준으로 최소 구현을 소개합니다. 실제 애플리케이션에서는
        아래처럼 여러 다이얼로그를 동시에 등록해 두고, 필요에 따라 컨트롤러 패턴을 확장하게 됩니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
      <p>
        기본 렌더러는 매우 단순합니다. 스토어 인스턴스를 그대로{' '}
        <InlineCode>DialogsRenderer</InlineCode>에 전달하면 등록된 컴포넌트를 DOM에 출력합니다.
      </p>
      <CodeBlock language="tsx" code={dialogRendererCode} />
    </Section>

    <Section as="h2" id="considerations" title="Considerations">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          여러 스토어를 사용할 경우 컨트롤러는 호출 시점에 가장 가까운 렌더러 컨텍스트를 참조합니다.
          멀티 스토어 전략이 필요하면 요청 단위로 인스턴스를 생성하거나 Provider 패턴을 도입하세요.
        </li>
        <li>
          <InlineCode>dialog.openAsync</InlineCode>는 비동기 모달 패턴을 단일 컨트롤러로 처리하도록
          해 주며, <InlineCode>dialog.update</InlineCode>로 진행 상태를 갱신할 수 있습니다.
        </li>
        <li>
          scroll lock, 접근성, 애니메이션 같은 전역 정책은 렌더러에서 구현하거나 별도 훅으로 추상화해
          조합하면 됩니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="Next Steps">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>DialogStore</InlineCode> 메서드와 스냅샷 구조는 핵심 개념 → DialogStore에서
          자세히 정리되어 있습니다.
        </li>
        <li>
          실제 다이얼로그 컴포넌트 패턴과 컨트롤러 활용법은 다이얼로그 만들기 섹션에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
