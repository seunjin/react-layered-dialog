import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ReactNode } from 'react';

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-2 rounded-md bg-gray-900 p-4 text-sm font-mono text-white">
    <code>{children}</code>
  </pre>
);

export const Introduction = () => (
  <div className="space-y-8">
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">소개</CardTitle>
        <CardDescription>
          선언적이고 타입-안전한 방식으로 React 다이얼로그를 관리하세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-base">
        <p>
          React 애플리케이션에서 다이얼로그(모달, 확인창, 알림창 등)를 관리하는 것은 종종 복잡한 상태 관리, z-index 충돌, 그리고 컴포넌트 간의 prop drilling을 유발합니다.
        </p>
        <p>
          <strong>React Layered Dialog</strong>는 이러한 문제들을 해결하기 위해 설계되었습니다. 단일 `useDialogs` 훅을 통해 애플리케이션 어디서든 다이얼로그를 열고 닫을 수 있는 중앙집중적인 API를 제공하여, 다이얼로그 관리를 단순하고 예측 가능하게 만듭니다.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>설치</CardTitle>
        <CardDescription>
          선호하는 패키지 매니저를 선택하여 라이브러리를 설치하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="npm">
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

    <Card>
      <CardHeader>
        <CardTitle>핵심 기능</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold">선언적 API</h3>
          <p className="mt-2 text-muted-foreground">
            `useState`로 각 다이얼로그의 열림 상태를 직접 관리하는 대신, `openDialog(&apos;alert&apos;, {'{...}'})`와 같이 &quot;무엇을&quot; 열고 싶은지만 선언하세요. 라이브러리가 &quot;어떻게&quot; 열고 닫을지를 관리하여 코드의 복잡성을 크게 줄여줍니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">타입 안정성</h3>
          <p className="mt-2 text-muted-foreground">
            `createUseDialogs` 팩토리 함수를 통해 사용자가 정의한 다이얼로그 `type`과 컴포넌트의 `props`를 연결합니다. 이를 통해 `openDialog` 호출 시 TypeScript가 `type`에 맞는 `props`를 자동으로 추론하고 잘못된 사용을 방지합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">자동 z-index 관리</h3>
          <p className="mt-2 text-muted-foreground">
            다이얼로그가 열릴 때마다 내부적으로 `baseZIndex`(기본값 1000)부터 1씩 증가하는 z-index를 자동으로 할당합니다. 이를 통해 여러 다이얼로그가 중첩되어도 항상 올바른 순서로 표시되며, z-index 충돌 문제를 걱정할 필요가 없습니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">유연성과 확장성</h3>
          <p className="mt-2 text-muted-foreground">
            `alert`, `confirm`과 같은 기본 타입 외에도, 어떤 React 컴포넌트든 `modal` 타입의 `children`으로 전달하여 다이얼로그로 만들 수 있습니다. 이를 통해 복잡한 폼이나 커스텀 UI를 포함하는 다이얼로그도 손쉽게 구현할 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>동작 원리 (How it Works)</CardTitle>
        <CardDescription>
          React Layered Dialog는 세 가지 핵심 요소로 구성되어 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">1. DialogManager (The Brain)</h4>
          <p className="mt-1 text-muted-foreground">
            라이브러리의 핵심 두뇌입니다. React에 의존하지 않는 순수 TypeScript 클래스로, 열려있는 모든 다이얼로그의 상태를 배열로 관리합니다. `open`, `close`와 같은 메서드를 통해 이 배열을 조작합니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">2. useSyncExternalStore (The Bridge)</h4>
          <p className="mt-1 text-muted-foreground">
            React 18에 도입된 이 훅은 React 외부의 상태 저장소(여기서는 `DialogManager`)를 React 컴포넌트와 연결하는 다리 역할을 합니다. `DialogManager`의 상태가 변경될 때마다 `useSyncExternalStore`가 이를 감지하여 컴포넌트의 효율적인 리렌더링을 트리거합니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">3. DialogRenderer (The Stage)</h4>
          <p className="mt-1 text-muted-foreground">
            `DialogManager`가 관리하는 다이얼로그 상태 배열을 구독하는 컴포넌트입니다. 배열의 내용에 따라 실제 다이얼로그 컴포넌트들(Alert, Confirm, Modal 등)을 DOM에 렌더링하는 무대 역할을 합니다.
          </p>
        </div>
        <div className="rounded-md border bg-muted/50 p-4 text-center">
          <p className="font-mono text-sm">
            `useDialogs()` → `DialogManager` 상태 변경 → `useSyncExternalStore` 감지 → `DialogRenderer` 리렌더링
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);
