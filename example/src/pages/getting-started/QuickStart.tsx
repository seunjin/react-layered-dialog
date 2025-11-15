import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import dialogsTsCode from '@/code-templates/DialogStoreQuickStart.ts.txt?raw';
import alertComponentCode from '@/code-templates/AlertQuickStart.tsx.txt?raw';
import appTsxCode from '@/code-templates/AppQuickStart.tsx.txt?raw';

export const QuickStart = () => (
  <DocArticle title="빠르게 시작하기">
    <p className="lead">
      세 파일과 간단한 엔트리 구성만으로 <InlineCode>DialogStore</InlineCode> 기반
      다이얼로그를 바로 실행할 수 있습니다. 여기서는 가장 작은 Alert 한 가지를
      예로 들어 새 API 흐름을 익힙니다.
    </p>

    <Section as="h2" id="prerequisites" title="사전 준비">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>pnpm add react-layered-dialog</InlineCode> 명령으로
          패키지를 설치합니다.
        </li>
        <li>
          예시는 <InlineCode>src/lib</InlineCode>,{' '}
          <InlineCode>src/components/dialogs</InlineCode> 폴더 구조를 기준으로
          설명합니다. 프로젝트 구조가 다르다면 경로만 조정하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="define" title="1. 스토어 만들기">
      <p>
        <InlineCode>src/lib/dialogs.ts</InlineCode> 파일에 아래 코드를 붙여 넣습니다.
        단일 <InlineCode>DialogStore</InlineCode> 인스턴스를 만들어 앱 전역에서 공유합니다.
        기본 사용법은 <InlineCode>dialog.open</InlineCode>으로 컴포넌트를 직접 렌더링하는
        방식입니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
    </Section>

    <Section as="h2" id="component" title="2. 다이얼로그 컴포넌트 작성">
      <p>
        <InlineCode>src/components/dialogs/Alert.tsx</InlineCode> 파일을 만들고 아래 코드를
        붙여 넣습니다. <InlineCode>useDialogController</InlineCode>에서 받은{' '}
        <InlineCode>close</InlineCode>/<InlineCode>unmount</InlineCode>만 호출해 닫기 동작을
        구현합니다.
      </p>
      <CodeBlock language="tsx" code={alertComponentCode} />
    </Section>

    <Section as="h2" id="entry" title="3. 애플리케이션에 연결">
      <p>
        엔트리 파일(<InlineCode>src/App.tsx</InlineCode> 등)에서{' '}
        <InlineCode>DialogsRenderer</InlineCode>에 <InlineCode>dialog</InlineCode>를 전달하고,
        버튼 클릭 시 <InlineCode>dialog.open</InlineCode>으로 컴포넌트를 직접 렌더링합니다.
      </p>
      <CodeBlock language="tsx" code={appTsxCode} />
      <p className="mt-2 text-sm text-muted-foreground">
        추가로, 레지스트리를 등록해 <InlineCode>createDialogApi</InlineCode> 기반의
        <InlineCode>dialog.alert({`{ title, message }`})</InlineCode> 같은 헬퍼 메서드로 확장할 수도
        있습니다.
      </p>
    </Section>
  </DocArticle>
);
