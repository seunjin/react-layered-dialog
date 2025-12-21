import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocCallout } from '@/components/docs/DocCallout';
import { DocLinks } from '@/components/docs/DocLink';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dialogsTsCode from '@/code-templates/DialogStoreQuickStart.ts.txt?raw';
import alertComponentCode from '@/code-templates/AlertQuickStart.tsx.txt?raw';
import appTsxCode from '@/code-templates/AppQuickStart.tsx.txt?raw';
import nextProviderCode from '@/code-templates/NextDialogProvider.tsx.txt?raw';
import nextUseDialogCode from '@/code-templates/NextUseDialog.ts.txt?raw';
import nextLayoutCode from '@/code-templates/NextLayout.tsx.txt?raw';

export const QuickStart = () => (
  <DocArticle title="Quick Start">
    <p className="lead">
      세 파일과 간단한 엔트리 구성만으로 <InlineCode>DialogStore</InlineCode> 기반
      다이얼로그를 바로 실행할 수 있습니다. <strong>사용 환경을 선택하세요.</strong>
    </p>

    <Section as="h2" id="prerequisites" title="Prerequisites">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>pnpm add react-layered-dialog</InlineCode> 명령으로
          패키지를 설치합니다.
        </li>
      </ul>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="setup" title="Setup">
      <Tabs defaultValue="react" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="react" className="text-sm">
            🟢 React SPA (Vite, CRA)
          </TabsTrigger>
          <TabsTrigger value="nextjs" className="text-sm">
            🔵 Next.js (App Router)
          </TabsTrigger>
        </TabsList>

        {/* ─────────────── React SPA Tab ─────────────── */}
        <TabsContent value="react" className="space-y-6">
          <p className="text-sm text-muted-foreground">
            SSR이 없는 순수 클라이언트 렌더링 환경에서는 전역 스토어를 간단히 사용할 수 있습니다.
          </p>

          <Section as="h3" id="react-store" title="1. Create Store">
            <p className="text-sm">
              <InlineCode>src/lib/dialogs.ts</InlineCode> 파일을 생성합니다.
            </p>
            <CodeBlock language="ts" code={dialogsTsCode} />
          </Section>

          <Section as="h3" id="react-component" title="2. Build Dialog Component">
            <p className="text-sm">
              <InlineCode>src/components/dialogs/Alert.tsx</InlineCode> 파일을 생성합니다.
            </p>
            <CodeBlock language="tsx" code={alertComponentCode} />
          </Section>

          <Section as="h3" id="react-entry" title="3. Wire into App">
            <p className="text-sm">
              엔트리 파일(<InlineCode>src/App.tsx</InlineCode>)에서 렌더러를 배치합니다.
            </p>
            <CodeBlock language="tsx" code={appTsxCode} />
          </Section>
        </TabsContent>

        {/* ─────────────── Next.js Tab ─────────────── */}
        <TabsContent value="nextjs" className="space-y-6">
          <DocCallout variant="warning" title="⚠️ SSR 보안 경고">
            <p className="text-sm">
              Next.js에서 전역 스토어를 사용하면 <strong>다른 사용자의 모달 상태가 공유</strong>될 수 있습니다.
              반드시 아래 Provider 패턴을 사용하세요.
            </p>
          </DocCallout>

          <div className="rounded border p-4 bg-muted/30 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">🤔 왜 React SPA와 다른가요?</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Next.js 서버에서 코드가 <strong>모든 사용자 요청에서 공유</strong>됩니다.</li>
              <li>전역 스토어를 사용하면 A 사용자의 모달이 B 사용자에게 보일 수 있습니다.</li>
              <li><InlineCode>useEffect</InlineCode>는 <strong>브라우저에서만 실행</strong>되므로 안전합니다.</li>
              <li>자세한 설명은 <a href="/api/advanced/ssr" className="text-primary underline">SSR 심화 가이드</a>를 참고하세요.</li>
            </ul>
          </div>

          <Section as="h3" id="next-provider" title="1. DialogProvider 생성">
            <p className="text-sm">
              <InlineCode>lib/dialog/DialogProvider.tsx</InlineCode> 파일을 생성합니다.
            </p>
            <CodeBlock language="tsx" code={nextProviderCode} />
          </Section>

          <Section as="h3" id="next-hook" title="2. useDialog 훅 생성">
            <p className="text-sm">
              <InlineCode>lib/dialog/useDialog.ts</InlineCode> 파일을 생성합니다.
            </p>
            <CodeBlock language="ts" code={nextUseDialogCode} />
          </Section>

          <Section as="h3" id="next-layout" title="3. layout.tsx에 적용">
            <p className="text-sm">
              <InlineCode>app/layout.tsx</InlineCode>에서 Provider를 적용합니다.
            </p>
            <CodeBlock language="tsx" code={nextLayoutCode} />
          </Section>

          <Section as="h3" id="next-usage" title="4. 사용하기">
            <CodeBlock
              language="tsx"
              code={`// app/page.tsx
"use client";
import { useDialog } from "@/lib/dialog/useDialog";
import { Alert } from "@/components/dialogs/Alert";

export default function Page() {
  const dialog = useDialog();

  return (
    <button onClick={() => dialog.open(() => <Alert title="안내" message="Hello!" />)}>
      다이얼로그 열기
    </button>
  );
}`}
            />
          </Section>
        </TabsContent>
      </Tabs>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="next-steps" title="Next Steps">
      <DocLinks
        links={[
          { to: '/fundamentals/architecture', label: '핵심 개념 → 아키텍처 개요' },
          { to: '/api/advanced/ssr', label: 'SSR 심화 가이드' },
        ]}
      />
    </Section>
  </DocArticle>
);
