import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { InlineCode } from '@/components/ui/InlineCode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
} from '@/components/ui/typography';
import type { ReactNode } from 'react';

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono text-muted-foreground">
    <code>{children}</code>
  </pre>
);

export const Introduction = () => (
  <div className="space-y-8">
    <div>
      <TypographyH1>소개 및 설치</TypographyH1>
      <TypographyLead>
        React 다이얼로그 관리를 위한 선언적이고 타입-안전한 솔루션
      </TypographyLead>

      <TypographyP>
        React 애플리케이션에서 다이얼로그를 관리하는 것은 흔히 복잡한 상태
        관리와 z-index 충돌을 야기합니다.{' '}
        <InlineCode>React Layered Dialog</InlineCode>는 이러한 문제를 해결하고자
        탄생했으며, 중앙 집중식 API를 통해 다이얼로그 관리를 단순화합니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH2>설치 방법</TypographyH2>
      <Card className="mt-6">
        <CardHeader>
          <CardDescription>
            선호하는 패키지 매니저를 선택하여 라이브러리를 설치하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pnpm">
            <TabsList>
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            </TabsList>
            <TabsContent value="npm">
              <CodeBlock>npm install react-layered-dialog</CodeBlock>
            </TabsContent>
            <TabsContent value="yarn">
              <CodeBlock>yarn add react-layered-dialog</CodeBlock>
            </TabsContent>
            <TabsContent value="pnpm">
              <CodeBlock>pnpm add react-layered-dialog</CodeBlock>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>

    <div>
      <TypographyH2>핵심 기능</TypographyH2>
      <div className="mt-6 space-y-6">
        <div>
          <TypographyH3>선언적 API</TypographyH3>
          <TypographyP>
            <InlineCode>useState</InlineCode>로 각 다이얼로그의 열림 상태를 직접
            관리하는 대신,{' '}
            <InlineCode>openDialog(&apos;alert&apos;, {'{...}'})</InlineCode>와
            같이 &quot;무엇을&quot; 열고 싶은지만 선언하세요. 라이브러리가
            &quot;어떻게&quot; 열고 닫을지를 관리하여 코드의 복잡성을 크게
            줄여줍니다.
          </TypographyP>
        </div>
        <div>
          <TypographyH3>타입 안정성</TypographyH3>
          <TypographyP>
            <InlineCode>createUseDialogs</InlineCode>
            팩토리 함수를 통해 사용자가 정의한 다이얼로그 `type`과 컴포넌트의
            <InlineCode>props</InlineCode>를 연결합니다. 이를 통해 `openDialog`
            호출 시 TypeScript가 <InlineCode>type</InlineCode>에 맞는{' '}
            <InlineCode>props</InlineCode>를 자동으로 추론하고 잘못된 사용을
            방지합니다.
          </TypographyP>
        </div>
        <div>
          <TypographyH3>자동 z-index 관리</TypographyH3>
          <TypographyP>
            다이얼로그가 열릴 때마다 내부적으로{' '}
            <InlineCode>baseZIndex</InlineCode>(기본값 1000)부터 1씩 증가하는
            z-index를 자동으로 할당합니다. 이를 통해 여러 다이얼로그가
            중첩되어도 항상 올바른 순서로 표시되며, z-index 충돌 문제를 걱정할
            필요가 없습니다.
          </TypographyP>
        </div>
        <div>
          <TypographyH3>유연성과 확장성</TypographyH3>
          <TypographyP>
            <InlineCode>alert</InlineCode>, <InlineCode>confirm</InlineCode>과
            같은 기본 타입 외에도, 어떤 React 컴포넌트든{' '}
            <InlineCode>modal</InlineCode> 타입의{' '}
            <InlineCode>children</InlineCode>으로 전달하여 다이얼로그로 만들 수
            있습니다. 이를 통해 복잡한 폼이나 커스텀 UI를 포함하는 다이얼로그도
            손쉽게 구현할 수 있습니다.
          </TypographyP>
        </div>
      </div>
    </div>

    <div>
      <TypographyH2>동작 원리 (How it Works)</TypographyH2>
      <TypographyP>
        React Layered Dialog는 세 가지 핵심 요소로 구성되어 있습니다.
      </TypographyP>
      <div className="mt-6 space-y-4">
        <div>
          <TypographyH4>1. DialogManager (핵심 엔진)</TypographyH4>
          <TypographyP>
            라이브러리의 핵심 두뇌입니다. React에 의존하지 않는 순수 TypeScript
            클래스로, 열려있는 모든 다이얼로그의 상태를 배열로 관리합니다.
            <InlineCode>open</InlineCode>, <InlineCode>close</InlineCode>와 같은
            메서드를 통해 이 배열을 조작합니다.
          </TypographyP>
        </div>
        <div>
          <TypographyH4>2. useSyncExternalStore (React와의 연결)</TypographyH4>
          <TypographyP>
            React 18에 도입된 이 훅은 React 외부의 상태 저장소(여기서는
            <InlineCode>DialogManager</InlineCode>)를 React 컴포넌트와 연결하는
            다리 역할을 합니다. <InlineCode>DialogManager</InlineCode>의 상태가
            변경될 때마다 <InlineCode>useSyncExternalStore</InlineCode>가 이를
            감지하여 컴포넌트의 효율적인 리렌더링을 트리거합니다.
          </TypographyP>
        </div>
        <div>
          <TypographyH4>3. DialogRenderer (렌더링 레이어)</TypographyH4>
          <TypographyP>
            <InlineCode>DialogManager</InlineCode>가 관리하는 다이얼로그 상태
            배열을 구독하는 컴포넌트입니다. 실제 다이얼로그 컴포넌트들(Alert,
            Confirm, Modal 등)을 DOM에 렌더링하는 무대 역할을 합니다.
          </TypographyP>
        </div>
        <div className="rounded-md border bg-muted/50 p-4 text-center">
          <p className="font-mono text-sm">
            useDialogs() → DialogManager 상태 변경 → useSyncExternalStore 감지 →
            DialogRenderer 리렌더링
          </p>
        </div>
      </div>
    </div>
  </div>
);
