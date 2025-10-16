import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

const npmInstallSnippet = `npm add react-layered-dialog`;
const yarnInstallSnippet = `yarn add react-layered-dialog`;
const pnpmInstallSnippet = `pnpm add react-layered-dialog`;

export const Introduction = () => (
  <DocArticle title="React Layered Dialog 소개">
    <p className="lead">
      이 라이브러리는 “얇은 스토어 + 타입 안전한 훅” 조합으로 다이얼로그 스택을
      관리합니다. 복잡한 상태 관리 라이브러리를 도입하지 않고도 선언적으로
      다이얼로그를 구성할 수 있습니다.
    </p>

    <Section as="h2" id="philosophy" title="핵심 철학">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>최소 코어</b>: 매니저는 배열을 관리하고, 어떤 UI를 렌더링할지
          결정하지 않습니다.
        </li>
        <li>
          <b>선언적 매핑</b>: <InlineCode>type</InlineCode>과 컴포넌트를 직접
          연결해 타입 안전성을 확보합니다.
        </li>
        <li>
          <b>선택적 확장</b>: ESC, 포커스 트랩 같은 동작은 애드온이나 사용자
          코드로 구현합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="install" title="설치">
      <Tabs>
        <TabsList>
          <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          <TabsTrigger value="npm">npm</TabsTrigger>
          <TabsTrigger value="yarn">yarn</TabsTrigger>
        </TabsList>
        <TabsContent value={'pnpm'}>
          <CodeBlock language="bash" code={pnpmInstallSnippet} />
        </TabsContent>
        <TabsContent value={'npm'}>
          <CodeBlock language="bash" code={npmInstallSnippet} />
        </TabsContent>
        <TabsContent value={'yarn'}>
          <CodeBlock language="bash" code={yarnInstallSnippet} />
        </TabsContent>
      </Tabs>
      <p className="mt-2 text-sm text-muted-foreground">
        애니메이션이나 포커스 트랩 등은 선호하는 라이브러리를 자유롭게 선택하여
        조합하세요.
      </p>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <Link
            to="/getting-started/quick-start"
            className="text-primary underline"
          >
            Quick Start
          </Link>
          에서 필수 파일을 설정합니다.
        </li>
        <li>
          <Link to="/core/architecture" className="text-primary underline">
            코어 아키텍처
          </Link>
          를 읽고 매니저/훅/렌더러의 역할을 이해합니다.
        </li>
        <li>
          <Link to="/examples/live-showcase" className="text-primary underline">
            Live Showcase
          </Link>
          에서 다양한 옵션을 실험하며 자신만의 다이얼로그 시스템을 구축하세요.
        </li>
      </ol>
    </Section>
  </DocArticle>
);
