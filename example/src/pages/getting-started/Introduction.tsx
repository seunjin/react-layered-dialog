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
      React Layered Dialog는 React 18 <InlineCode>useSyncExternalStore</InlineCode>를
      기반으로 하는 초경량 다이얼로그 매니저입니다. 전역 상태 라이브러리 없이도
      다이얼로그를 배열 스택으로 추적하고, 타입 정의만으로 선언적
      <InlineCode>openDialog</InlineCode> 경험을 제공합니다.
    </p>
    <p className="mt-4 text-muted-foreground">
      1KB 남짓한 코어가 레이어 <InlineCode>z-index</InlineCode>와 상태 동기화를 담당하고,
      UI·애니메이션·포커스 전략은 애플리케이션이 자유롭게 선택하도록 설계되어 있습니다.
    </p>

    <Section as="h2" id="why-unique" title="React Layered Dialog가 특별한 이유">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>자동 스택 관리</b>: 다이얼로그를 배열로 관리하며 중첩 순서에 따라{' '}
          <InlineCode>z-index</InlineCode>를 자동으로 계산합니다.
        </li>
        <li>
          <b>타입 안전한 API</b>: 상태 타입과 컴포넌트를 매핑하면
          <InlineCode>openDialog(&apos;confirm&apos;, …)</InlineCode> 같은 호출부터 타입 검증이
          적용됩니다.
        </li>
        <li>
          <b>미니멀 코어</b>: 전역 스토어나 UI 프레임워크에 종속되지 않아 기존 디자인
          시스템과 쉽게 통합됩니다.
        </li>
        <li>
          <b>선택적 동작</b>: ESC, 외부 클릭 등은 <InlineCode>useLayerBehavior</InlineCode>로
          필요한 만큼만 opt-in 할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="philosophy" title="핵심 철학">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>얇은 전역 스토어</b>:{' '}
          <InlineCode>useSyncExternalStore</InlineCode> 기반 매니저가 다이얼로그 배열만
          추적하고 나머지 정책은 호출자에게 위임합니다.
        </li>
        <li>
          <b>타입-구동 매핑</b>: <InlineCode>type</InlineCode> 필드와 컴포넌트를 상관된
          유니온으로 연결해 상태·UI 관계를 정적 타이핑으로 보장합니다.
        </li>
        <li>
          <b>선언적 옵션</b>: <InlineCode>BaseState</InlineCode> 패턴으로 dim, ESC,
          <InlineCode>z-index</InlineCode> 등을 옵션화해 필요한 동작만 명시합니다.
        </li>
        <li>
          <b>확장 가능한 동작</b>: 포커스, 애니메이션, 접근성 전략은 사용자 코드나 애드온으로
          구성하되 코어는 이를 방해하지 않습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="scenarios" title="언제 도움이 되나요?">
      <ul className="ml-6 list-disc space-y-2">
        <li>여러 개의 다이얼로그를 중첩해도 상태 끌어올리기 없이 관리하고 싶은 경우</li>
        <li>디자인 시스템이 다른 프로젝트에서 공통 다이얼로그 매니저가 필요한 경우</li>
        <li>전역 상태 라이브러리를 추가하지 않고도 다이얼로그 상태를 제어하려는 경우</li>
        <li>테스트 가능한 선언적 API로 비즈니스 로직과 UI를 분리하고 싶은 경우</li>
      </ul>
    </Section>

    <Section as="h2" id="install" title="설치">
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
        애니메이션이나 포커스 트랩 등은 선호하는 라이브러리를 자유롭게 선택하여 조합하세요.
      </p>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <Link to="/getting-started/quick-start" className="text-primary underline">
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
