import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';
import alertComponentCode from '@/code-templates/AlertBasic.tsx.txt?raw';
import dialogRendererCode from '@/code-templates/DialogRenderer.tsx.txt?raw';
import appTsxCode from '@/code-templates/App.tsx.txt?raw';
import usageCode from '@/code-templates/usage.tsx.txt?raw';

export const QuickStart = () => (
  <DocArticle title="Quick Start">
    <p className="lead">
      설치 직후 복사해 붙여 넣을 수 있는 네 개의 파일만으로 기본 다이얼로그
      스택을 완성합니다. 코어는 상태와 스택을 관리하고, UI와 동작은 애플리케이션이
      직접 구성하는 것이 핵심입니다.
    </p>

    <Section as="h2" id="prerequisites" title="시작 전 준비">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>pnpm add react-layered-dialog</InlineCode> (또는 npm/yarn)으로
          패키지를 설치합니다.
        </li>
        <li>
          아래 스텝에서는 <InlineCode>src/lib</InlineCode>와{' '}
          <InlineCode>src/components/dialogs</InlineCode> 폴더가 있다고 가정합니다.
          구조가 다르다면 경로만 조정해서 적용하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="define" title="1. 다이얼로그 시스템 정의">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <InlineCode>src/lib/dialogs.ts</InlineCode> 파일을 만들고 아래 코드를
          그대로 붙여 넣습니다.
        </li>
        <li>
          <InlineCode>AppDialogState</InlineCode> 유니온의 모든 분기에{' '}
          <InlineCode>type</InlineCode>을 정의하면, 매니저와 훅이 타입 안전하게
          상태를 좁혀 줍니다.
        </li>
        <li>
          <InlineCode>createDialogManager</InlineCode>와{' '}
          <InlineCode>createUseDialogs</InlineCode> 호출 결과를 export하여 앱 전역에서
          재사용합니다.
        </li>
      </ol>
      <p className="mt-2">
        이 단계에서는 <InlineCode>DialogState</InlineCode>를 이용해 컴포넌트에서 바로
        사용할 수 있는 <InlineCode>AlertDialogProps</InlineCode> 같은 타입도 함께
        export합니다. 이후 UI 컴포넌트에서 별도 타입 선언 없이 곧바로 import할 수
        있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <Link to="/core/core-types" className="text-primary underline">
          Core → 코어 타입 가이드
        </Link>
        에서 <InlineCode>BaseState</InlineCode>,
        <InlineCode>DialogState</InlineCode> 등이 제공하는 공통 옵션을 확인해 두면
        커스텀 다이얼로그를 확장할 때 유용합니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
    </Section>

    <Section as="h2" id="component" title="2. 다이얼로그 컴포넌트 작성">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <InlineCode>src/components/dialogs/Alert.tsx</InlineCode> (또는 원하는
          위치) 파일을 만들고 아래 코드를 붙여 넣습니다.
        </li>
        <li>
          <InlineCode>useDialogs</InlineCode> 훅에서 제공하는{' '}
          <InlineCode>dialogs</InlineCode> 배열과 <InlineCode>closeDialog</InlineCode>를
          사용해 UI와 인터랙션을 구축합니다.
        </li>
        <li>
          포커스/ESC/외부 클릭 동작은 필요 시{' '}
          <InlineCode>useLayerBehavior</InlineCode>를 추가해 확장합니다.
        </li>
      </ol>
      <p className="mt-2">
        <InlineCode>AlertDialogProps</InlineCode> 타입을 <InlineCode>src/lib/dialogs</InlineCode>
        에서 import하면 <InlineCode>DialogState</InlineCode>가 확장한 공통 필드(
        <InlineCode>dismissable</InlineCode>, <InlineCode>dimmed</InlineCode> 등)를 그대로
        사용할 수 있습니다. Quick Start 예제는 <InlineCode>useLayerBehavior</InlineCode>를
        조합해 ESC·외부 클릭 처리까지 구현합니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        아래 코드는 하나의 기본 예시일 뿐이며, 실제 프로젝트에서는 UI 라이브러리나
        디자인 시스템에 맞게 자유롭게 구성 요소와 스타일을 수정해도 됩니다.
      </p>
      <CodeBlock language="tsx" code={alertComponentCode} />
    </Section>

    <Section as="h2" id="renderer" title="3. 렌더러와 진입점 구성">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <InlineCode>DialogRenderer</InlineCode> 컴포넌트를 프로젝트에 추가해 열린
          다이얼로그 배열을 순회하도록 합니다.
        </li>
        <li>
          앱 엔트리에서 <InlineCode>useDialogs</InlineCode>를 호출한 뒤, UI 루트
          어딘가(일반적으로 <InlineCode>&lt;App /&gt;</InlineCode> 상단)에 렌더러를
          배치합니다.
        </li>
      </ol>
      <p className="mt-2">
        기본 렌더러는 단순히 열린 다이얼로그를 순서대로 렌더링합니다. 예시처럼
        마크업을 분리해 두면 테스트와 커스터마이징이 쉬워집니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <InlineCode>scrollLock</InlineCode> 옵션을 사용할 계획이라면, 렌더러에서
        <InlineCode>document.body</InlineCode>에 <InlineCode>scroll-locked</InlineCode> 클래스를
        추가/제거하는 로직을 직접 구현하고, 전역 스타일에 다음 규칙을 등록하세요:
      </p>
      <CodeBlock language="css" code={`.scroll-locked {\n  overflow: hidden;\n}`} />
      <p className="mt-2 text-muted-foreground">
        전역 스크롤 잠금이 필요 없다면 위 로직을 자유롭게 삭제해도 됩니다. 이 예제는
        편의상 구현 방법을 보여주기 위한 것입니다.
      </p>
      <CodeBlock language="tsx" code={dialogRendererCode} />
      <p className="mt-2 text-sm text-muted-foreground">
        애니메이션을 추가하고 싶다면{' '}
        <Link to="/examples/live-showcase" className="text-primary underline">
          Examples → Live Showcase
        </Link>
        에서 Framer Motion 기반 구현을 살펴보거나,{' '}
        <Link
          to="https://github.com/seunjin/react-layered-dialog/blob/main/example/src/code-templates/AlertAnimated.tsx.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          AlertAnimated.tsx
        </Link>
        와{' '}
        <Link
          to="https://github.com/seunjin/react-layered-dialog/blob/main/example/src/code-templates/ConfirmAnimated.tsx.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          ConfirmAnimated.tsx
        </Link>
        템플릿을 참고하세요.
      </p>
      <CodeBlock language="tsx" code={appTsxCode} />
    </Section>

    <Section as="h2" id="open" title="4. 다이얼로그 열기">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          훅이 반환하는 <InlineCode>openDialog</InlineCode>를 사용해 필요한 곳에서
          다이얼로그를 호출합니다.
        </li>
        <li>
          동일한 API로 <InlineCode>closeDialog</InlineCode>,
          <InlineCode>updateDialog</InlineCode>를 사용하면 스택을 선언적으로 관리할 수
          있습니다.
        </li>
      </ol>
      <CodeBlock language="tsx" code={usageCode} />
      <p className="mt-2 text-sm text-muted-foreground">
        더 많은 패턴은 <InlineCode>Guides</InlineCode> 섹션을 참고하세요. ESC, 포커스
        트랩 등을 추가하려면 <InlineCode>useLayerBehavior</InlineCode> 애드온을
        조합하면 됩니다.
      </p>
    </Section>
  </DocArticle>
);
