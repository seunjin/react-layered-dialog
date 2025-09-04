import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocArticle } from '@/components/docs/DocArticle';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const Introduction = () => (
  <DocArticle>
    <h1>React Layered Dialog</h1>
    <p className="lead">
      <code className="font-mono">useSyncExternalStore</code>를 활용한, 외부
      상태 관리 라이브러리가 필요 없는 React 다이얼로그 솔루션
    </p>

    <div className="my-6 rounded-lg border bg-muted/30 p-4 text-center">
      <p className="text-lg font-semibold">
        [라이브러리 동작 GIF/스크린샷 영역]
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        여러 다이얼로그가 중첩되고 순서에 맞게 관리되는 모습을 보여주는 이미지
      </p>
    </div>

    <p>
      <InlineCode>React Layered Dialog</InlineCode>는 React 18의{' '}
      <InlineCode>useSyncExternalStore</InlineCode> 훅을 기반으로 설계되어,
      Zustand나 Redux와 같은 외부 전역 상태 관리 라이브러리 없이 다이얼로그
      상태를 효율적으로 관리합니다. 이를 통해 설정의 복잡함을 줄이고 React의
      렌더링 메커니즘과 완벽하게 통합되어 최적의 성능을 제공합니다.
    </p>

    <h2>3분만에 시작하기</h2>
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="pnpm">
          <TabsList>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          </TabsList>
          <TabsContent value="npm">
            <CodeBlock
              language="bash"
              code={`npm install react-layered-dialog
# Optional for animations
npm install motion`}
            />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock
              language="bash"
              code={`yarn add react-layered-dialog
# Optional for animations
yarn add motion`}
            />
          </TabsContent>
          <TabsContent value="pnpm">
            <CodeBlock
              language="bash"
              code={`pnpm add react-layered-dialog
# Optional for animations
pnpm add motion`}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-4">
          <p>
            라이브러리 설치 후,{' '}
            <Link
              to="/getting-started/quick-start"
              className="font-medium text-primary underline"
            >
              Quick Start
            </Link>{' '}
            페이지를 따라 핵심 파일을 설정해보세요.
          </p>
        </div>
      </CardContent>
    </Card>

    <h2>주요 특징</h2>
    <div className="not-prose space-y-4">
      <Alert>
        <div>
          <AlertTitle>최적화된 렌더링</AlertTitle>
          <AlertDescription>
            <InlineCode>useSyncExternalStore</InlineCode>를 사용하여 상태가
            변경될 때 오직 필요한 컴포넌트만 리렌더링합니다. 이를 통해 불필요한
            렌더링을 방지하고 최적의 성능을 보장합니다.
          </AlertDescription>
        </div>
      </Alert>
      <Alert>
        <div>
          <AlertTitle>Type-Safe API</AlertTitle>
          <AlertDescription>
            TypeScript 기반으로 설계되어, 다이얼로그를 열 때 필요한 `props`를
            자동으로 추론하고 잘못된 사용을 방지합니다.
          </AlertDescription>
        </div>
      </Alert>
      <Alert>
        <div>
          <AlertTitle>Flexible & Extensible</AlertTitle>
          <AlertDescription>
            어떤 UI 컴포넌트 라이브러리와도 쉽게 통합하여 사용할 수 있으며,
            자유롭게 커스터마이징이 가능합니다.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  </DocArticle>
);
