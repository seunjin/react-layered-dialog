import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { DocCallout } from '@/components/docs/DocCallout';

const dangerPattern = `// ❌ 절대 금지: 서버에서 공유되는 전역 스토어
export const store = new DialogStore();
// → A 사용자가 연 모달이 B 사용자에게 보이는 심각한 보안 사고 발생 가능`;

const safePattern = `// ✅ 권장: Client-Only Provider 패턴
"use client";

import { useState, useEffect } from 'react';
import { DialogStore, DialogsRenderer } from 'react-layered-dialog';

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<DialogStore | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // useEffect는 브라우저에서만 실행됨 (서버에서는 절대 실행 안 됨)
    // → 스토어가 서버 메모리에 올라가지 않음 = 요청 간 공유 불가
    setStore(new DialogStore());
    setIsMounted(true); // hydration 완료 표시
  }, []);

  return (
    <>
      {children}
      {/* isMounted가 true일 때만 렌더러 표시 → Hydration Mismatch 방지 */}
      {isMounted && store && <DialogsRenderer store={store} />}
    </>
  );
}`;

const proxyPattern = `// SSR에서도 안전하게 호출할 수 있는 useDialog 훅
export function useDialog(): DialogStore {
  const store = useDialogStore(); // Context에서 가져옴 (초기에는 null)

  return useMemo(() => {
    // 스토어가 이미 준비되어 있으면 그대로 반환
    if (store) return store;

    // 스토어가 아직 없으면 (SSR 시점 또는 초기 마운트 전)
    // → "가짜 객체"를 반환해서 에러 방지
    return new Proxy({} as DialogStore, {
      get(_, prop) {
        // 어떤 메서드를 호출해도 경고만 출력하고 앱은 죽지 않음
        return (...args: unknown[]) => {
          console.warn(\`[Dialog] Store 미준비 상태에서 '\${String(prop)}' 호출됨\`);
          // 아무것도 하지 않고 무시
        };
      },
    });
  }, [store]);
}`;

const layoutExample = `// app/layout.tsx
import { DialogProvider } from "@/lib/dialog/DialogProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <DialogProvider>{children}</DialogProvider>
      </body>
    </html>
  );
}`;

const edgeWarning = `// ❌ Edge Runtime에서도 위험
export const store = new DialogStore();

// ✅ 안전: 클라이언트에서만 생성
const [store, setStore] = useState<DialogStore | null>(null);
useEffect(() => setStore(new DialogStore()), []);`;

const debugTips = `// 1. 스토어 생성 시점 확인
useEffect(() => {
  console.log('[Dialog] 스토어 생성 - 이 로그는 브라우저 콘솔에서만 보여야 함');
  console.log('[Dialog] 서버 로그(터미널)에서 보이면 잘못된 것!');
  setStore(new DialogStore());
}, []);

// 2. 서버/클라이언트 환경 확인
if (typeof window === 'undefined') {
  console.log('[Dialog] 현재 서버 환경');
} else {
  console.log('[Dialog] 현재 클라이언트(브라우저) 환경');
}`;

export const ApiAdvancedSSRPage = () => (
  <DocArticle title="SSR 지원">
    <p className="lead">
      Next.js App Router 및 SSR 환경에서 <InlineCode>react-layered-dialog</InlineCode>를
      안전하게 사용하는 방법을 다룹니다.
    </p>

    <DocCallout variant="warning" title="⚠️ 핵심 보안 경고">
      <p>
        Next.js 서버에서 전역 스토어를 생성하면{' '}
        <strong>다른 사용자의 모달 상태가 공유</strong>될 수 있습니다.
        이는 심각한 보안 사고입니다.
      </p>
    </DocCallout>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="why" title="왜 Next.js에서 특별한 패턴이 필요한가?">
      <p className="text-sm text-muted-foreground mb-4">
        Next.js는 <strong>React SPA와 근본적으로 다른 실행 모델</strong>을 가집니다.
        이 차이를 이해해야 안전하게 상태를 관리할 수 있습니다.
      </p>

      <Section as="h3" id="spa-vs-ssr" title="React SPA vs Next.js SSR 비교">
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="rounded border p-4 bg-muted/30">
            <p className="font-semibold text-foreground mb-2">🟢 React SPA (Vite, CRA)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>실행 환경</strong>: 모든 코드가 브라우저에서만 실행됩니다.</li>
              <li><strong>인스턴스</strong>: 각 사용자마다 별도의 브라우저 탭이 열리고, 각 탭은 완전히 격리됩니다.</li>
              <li><strong>전역 변수</strong>: 해당 브라우저 탭 내에서만 존재합니다. 다른 사용자에게 영향 없음.</li>
              <li><strong>결론</strong>: <InlineCode>export const store = new DialogStore()</InlineCode>를 파일 최상위에 써도 안전합니다.</li>
            </ul>
          </div>

          <div className="rounded border p-4 bg-destructive/10">
            <p className="font-semibold text-foreground mb-2">🔵 Next.js (SSR/RSC)</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>실행 환경</strong>: 코드가 서버(Node.js)에서 먼저 실행된 후, 결과가 브라우저로 전송됩니다.</li>
              <li><strong>인스턴스</strong>: 서버는 <strong>하나의 Node.js 프로세스</strong>입니다. 모든 사용자 요청이 이 프로세스를 공유합니다.</li>
              <li><strong>전역 변수</strong>: <strong>모든 사용자 요청에서 공유</strong>됩니다! 사용자 A의 상태가 사용자 B에게 보일 수 있습니다.</li>
              <li><strong>결론</strong>: 파일 최상위에 <InlineCode>new DialogStore()</InlineCode>를 쓰면 보안 사고 발생!</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section as="h3" id="memory-sharing" title="서버 메모리 공유 문제 (상세)">
        <p className="text-sm text-muted-foreground mb-3">
          아래 코드를 보세요. React SPA에서는 문제없지만, Next.js에서는 심각한 버그입니다:
        </p>
        <CodeBlock
          language="ts"
          code={`// lib/dialog.ts
import { DialogStore } from 'react-layered-dialog';

// 이 코드는 서버가 시작될 때 딱 한 번만 실행됨
// 이후 모든 사용자 요청이 이 'dialog' 인스턴스를 공유!
export const dialog = new DialogStore();`}
        />
        <div className="mt-4 p-4 rounded border bg-muted/30 text-sm">
          <p className="font-semibold text-foreground mb-2">🔴 실제 시나리오:</p>
          <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
            <li>오전 9:00 - 서버 시작, <InlineCode>dialog</InlineCode> 인스턴스 생성 (빈 상태)</li>
            <li>오전 9:05 - 사용자 A가 접속, <InlineCode>dialog.open({"<ConfirmModal />"})</InlineCode> 호출</li>
            <li>오전 9:06 - 사용자 B가 접속, 화면을 보니 <strong>사용자 A가 연 모달이 보임!</strong></li>
            <li>사용자 B가 모달을 닫으면 사용자 A의 화면에서도 모달이 닫힘</li>
          </ol>
          <p className="mt-3 text-destructive font-semibold">
            → 사용자 간 상태가 섞이는 심각한 보안 사고!
          </p>
        </div>
      </Section>

      <Section as="h3" id="hydration" title="Hydration Mismatch (상세)">
        <p className="text-sm text-muted-foreground mb-3">
          <strong>Hydration</strong>이란 서버에서 생성된 HTML에 React가 이벤트 핸들러를 붙이는 과정입니다.
        </p>
        <div className="p-4 rounded border bg-muted/30 text-sm text-muted-foreground space-y-2">
          <p><strong>1단계 (서버)</strong>: React가 컴포넌트를 실행해서 HTML 문자열을 생성</p>
          <p><strong>2단계 (네트워크)</strong>: 이 HTML이 브라우저로 전송됨</p>
          <p><strong>3단계 (클라이언트)</strong>: React가 같은 컴포넌트를 다시 실행해서 가상 DOM 생성</p>
          <p><strong>4단계 (비교)</strong>: 서버 HTML과 클라이언트 가상 DOM이 일치하는지 확인</p>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          만약 서버에서는 <InlineCode>{"<DialogsRenderer />"}</InlineCode>가 렌더링되었는데,
          클라이언트에서는 조건에 따라 렌더링되지 않으면 <strong>불일치(Mismatch)</strong>가 발생합니다.
          React는 경고를 출력하고 전체 트리를 다시 렌더링해야 하므로 성능이 저하됩니다.
        </p>
      </Section>

      <Section as="h3" id="window" title="window/document 미존재 (상세)">
        <p className="text-sm text-muted-foreground mb-3">
          서버는 <strong>Node.js 환경</strong>이므로 브라우저 전용 객체가 없습니다:
        </p>
        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
          <li><InlineCode>window</InlineCode> - 브라우저 창 객체 (없음)</li>
          <li><InlineCode>document</InlineCode> - DOM 문서 객체 (없음)</li>
          <li><InlineCode>localStorage</InlineCode>, <InlineCode>sessionStorage</InlineCode> (없음)</li>
          <li><InlineCode>navigator</InlineCode>, <InlineCode>location</InlineCode> (없음)</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          만약 스토어나 렌더러 내부에서 이들에 접근하면 <InlineCode>ReferenceError: window is not defined</InlineCode> 에러가 발생합니다.
        </p>
      </Section>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="solution" title="해결책: 각 패턴의 이유">
      <Section as="h3" id="why-provider" title="왜 useState + useEffect 패턴인가?">
        <p className="text-sm text-muted-foreground mb-3">
          핵심 원리는 <strong>스토어 생성을 브라우저로 완전히 미루는 것</strong>입니다:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground mb-4">
          <li>
            <strong><InlineCode>useState(null)</InlineCode></strong>: 초기값은 <InlineCode>null</InlineCode>입니다.
            서버에서 렌더링할 때 스토어 인스턴스가 생성되지 않습니다.
          </li>
          <li>
            <strong><InlineCode>useEffect</InlineCode></strong>: 이 훅은 <strong>브라우저에서만 실행</strong>됩니다.
            서버에서는 절대 실행되지 않습니다. 따라서 <InlineCode>new DialogStore()</InlineCode>는
            브라우저에서만 호출됩니다.
          </li>
          <li>
            <strong>결과</strong>: 각 사용자의 브라우저마다 독립적인 스토어 인스턴스가 생성됩니다.
            서버 메모리 공유 문제가 원천 차단됩니다.
          </li>
        </ul>
        <CodeBlock language="tsx" code={safePattern} />
      </Section>

      <Section as="h3" id="why-ismounted" title="왜 isMounted 상태가 필요한가?">
        <p className="text-sm text-muted-foreground mb-3">
          <InlineCode>isMounted</InlineCode>는 <strong>&ldquo;Hydration이 완료되었다&rdquo;</strong>를 나타내는 플래그입니다:
        </p>
        <div className="p-4 rounded border bg-muted/30 text-sm text-muted-foreground space-y-2 mb-4">
          <p><strong>서버 렌더링 시</strong>: <InlineCode>isMounted = false</InlineCode> → <InlineCode>DialogsRenderer</InlineCode> 렌더링 안 함</p>
          <p><strong>클라이언트 첫 렌더링 시</strong>: <InlineCode>isMounted = false</InlineCode> → 서버와 동일하게 렌더러 없음</p>
          <p><strong>useEffect 실행 후</strong>: <InlineCode>isMounted = true</InlineCode> → 이제 렌더러 표시</p>
        </div>
        <p className="text-sm text-muted-foreground">
          이렇게 하면 서버와 클라이언트의 초기 렌더링 결과가 <strong>완전히 동일</strong>해집니다.
          Hydration Mismatch가 발생하지 않습니다. <InlineCode>useEffect</InlineCode> 이후에 렌더러가
          나타나는 것은 정상적인 클라이언트 업데이트이므로 React가 문제 삼지 않습니다.
        </p>
      </Section>

      <Section as="h3" id="why-proxy" title="왜 Proxy 패턴인가?">
        <p className="text-sm text-muted-foreground mb-3">
          Provider 패턴의 <strong>부작용</strong>이 있습니다: 초기 렌더링 시점에 스토어가 <InlineCode>null</InlineCode>입니다.
        </p>
        <div className="p-4 rounded border bg-muted/30 text-sm text-muted-foreground space-y-2 mb-4">
          <p><strong>문제 상황</strong>:</p>
          <code className="block bg-muted p-2 rounded">
            {`const dialog = useDialog(); // 반환값이 null
dialog.open(() => <Modal />); // ❌ TypeError: Cannot read property 'open' of null`}
          </code>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          매번 <InlineCode>if (dialog) dialog.open(...)</InlineCode> 체크를 하는 것은 번거롭습니다.
          <strong>Proxy 패턴</strong>을 사용하면 스토어가 없어도 메서드를 호출할 수 있습니다:
        </p>
        <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground mb-4">
          <li>JavaScript <InlineCode>Proxy</InlineCode>는 객체에 대한 접근을 가로채서 원하는 동작을 수행할 수 있게 합니다.</li>
          <li>스토어가 <InlineCode>null</InlineCode>일 때 빈 객체 <InlineCode>{"{}"}</InlineCode>에 Proxy를 씌웁니다.</li>
          <li>어떤 속성에 접근하든 (예: <InlineCode>.open</InlineCode>) <InlineCode>get</InlineCode> 트랩이 실행됩니다.</li>
          <li>트랩은 경고만 출력하고 아무것도 하지 않는 함수를 반환합니다.</li>
          <li>결과: 앱이 죽지 않고, 개발자는 콘솔에서 문제를 인지할 수 있습니다.</li>
        </ul>
        <CodeBlock language="tsx" code={proxyPattern} />
      </Section>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="danger" title="❌ 위험한 패턴">
      <CodeBlock language="ts" code={dangerPattern} />
    </Section>

    <Section as="h2" id="layout" title="Next.js App Router 적용">
      <CodeBlock language="tsx" code={layoutExample} />
    </Section>

    <Section as="h2" id="edge" title="Edge Runtime 주의">
      <p className="text-sm text-muted-foreground mb-4">
        Vercel Edge Functions, Cloudflare Workers 등에서도 동일한 문제가 발생합니다.
        Edge Runtime은 Node.js와 다른 격리 모델을 사용하지만, 여전히 전역 변수가 요청 간 공유될 수 있습니다.
      </p>
      <CodeBlock language="ts" code={edgeWarning} />
    </Section>

    <Section as="h2" id="debug" title="디버깅 팁">
      <CodeBlock language="tsx" code={debugTips} />
      <p className="mt-4 text-sm text-muted-foreground">흔한 실수 체크리스트:</p>
      <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
        <li><InlineCode>&quot;use client&quot;</InlineCode> 지시어를 빼먹지 않았는가?</li>
        <li><InlineCode>DialogsRenderer</InlineCode>를 서버 컴포넌트에서 직접 렌더링하고 있지 않은가?</li>
        <li>전역 스코프에서 <InlineCode>new DialogStore()</InlineCode>를 호출하고 있지 않은가?</li>
      </ul>
    </Section>

    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/api/advanced/multi-store', label: '멀티 스토어 운영' },
          { to: '/getting-started/quick-start', label: 'Quick Start (Next.js 가이드 포함)' },
          { to: '/fundamentals/architecture', label: '핵심 개념 → 아키텍처 개요' },
        ]}
      />
    </Section>
  </DocArticle>
);
