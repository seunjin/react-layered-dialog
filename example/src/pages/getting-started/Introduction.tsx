import { Link } from 'react-router-dom';
import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

const pnpmInstallSnippet = `pnpm add react-layered-dialog`;
const npmInstallSnippet = `npm add react-layered-dialog`;
const yarnInstallSnippet = `yarn add react-layered-dialog`;

export const Introduction = () => (
  <DocArticle title="Introduction to React Layered Dialog">
    <p className="lead">
      React Layered Dialog는 <InlineCode>DialogStore</InlineCode>와{' '}
      <InlineCode>createDialogApi</InlineCode> 기반으로 다이얼로그 스택을 선언적으로
      제어할 수 있게 해 주는 경량 라이브러리입니다. React 18의{' '}
      <InlineCode>useSyncExternalStore</InlineCode>를 활용해 별도 전역 상태 없이도
      안전한 타입과 일관된 렌더링을 제공합니다.
    </p>
    <p className="mt-4 text-muted-foreground">
      코어는 다이얼로그 스택과 z-index, 비동기 상태만 관리하고, UI 구현과 접근성 전략은
      애플리케이션 코드에 맡겨둡니다. 이 문서는 새 API 흐름을 기준으로 다양한 컴포넌트와
      패턴을 단계적으로 안내합니다.
    </p>

    <Section as="h2" id="why-unique" title="What Makes It Unique?">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>스토어 중심 설계</b>: 단일 <InlineCode>DialogStore</InlineCode> 인스턴스가 모든
          다이얼로그를 관리해 어디서나 동일한 컨텍스트를 공유할 수 있습니다.
        </li>
        <li>
          <b>타입 안전성</b>: <InlineCode>createDialogApi</InlineCode>로 타입과 컴포넌트를
          등록하면 <InlineCode>dialog.confirm(props)</InlineCode> 또는
          <InlineCode>dialog.confirm((c) =&gt; props)</InlineCode> 호출부터 자동으로 타입 검증을
          거칩니다.
        </li>
        <li>
          <b>컨트롤러 패턴</b>: <InlineCode>useDialogController</InlineCode> 훅이 다이얼로그
          내부에서 닫기(close), 언마운트(unmount), 상태 업데이트(update)를 일관되게 제공합니다.
        </li>
        <li>
          <b>필요한 동작만 구현</b>: 라이브러리는 다이얼로그 스택(z-index, 상태)만 관리합니다.
          ESC, 외부 클릭, 스크롤 락, 포커스 트랩 등은 사용자 코드(유틸/컴포넌트)로 직접
          구성하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="scenarios" title="When It’s Useful">
      <ul className="ml-6 list-disc space-y-2">
        <li>디자인 시스템마다 다른 UI를 유지하면서도 공통 다이얼로그 매니저를 사용하고 싶을 때</li>
        <li>복잡한 상태 끌어올리기를 피하고 선언적 API로 비즈니스 로직을 분리하고 싶을 때</li>
        <li>중첩 다이얼로그를 안전하게 관리하거나 비동기 확인 모달 패턴을 표준화하고 싶을 때</li>
      </ul>
    </Section>

    <Section as="h2" id="install" title="Install">
      <Tabs defaultValue="pnpm">
        <TabsList>
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
        </TabsList>
        <TabsContent value="pnpm">
          <CodeBlock language="bash" code={pnpmInstallSnippet} />
        </TabsContent>
        <TabsContent value="npm">
          <CodeBlock language="bash" code={npmInstallSnippet} />
        </TabsContent>
        <TabsContent value="yarn">
          <CodeBlock language="bash" code={yarnInstallSnippet} />
        </TabsContent>
      </Tabs>
      <p className="mt-2 text-sm text-muted-foreground">
        애플리케이션에 맞는 접근성, 포커스 제어, 스타일링은 별도 라이브러리나 유틸리티와
        조합해 구현할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="next" title="Next Steps">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <Link to="/getting-started/quick-start" className="text-primary underline">
            Quick Start
          </Link>
          에서 <InlineCode>DialogStore</InlineCode> 설정과 렌더러 배치를 익혀 보세요.
        </li>
        <li>핵심 개념과 다이얼로그 제작 가이드는 순차적으로 추가될 예정입니다.</li>
      </ol>
    </Section>
  </DocArticle>
);
