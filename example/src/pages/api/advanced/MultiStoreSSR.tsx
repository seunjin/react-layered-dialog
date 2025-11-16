import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const guideline = `// 멀티 스토어/SSR 가이드
// - 요청 단위로 DialogStore 인스턴스를 생성
// - 각 스토어마다 DialogsRenderer를 배치해 컨텍스트 연결
// - 전역 싱글턴이 필요하지 않음

function createRequestScopedDialog() {
  const store = new DialogStore();
  const dialog = createDialogApi(store, registry);
  return { store, dialog };
}`;

const withRenderer = `export function AppShell({ store }: { store: DialogStore }) {
  return (
    <>
      <MainRoutes />
      <DialogsRenderer store={store} />
    </>
  );
}`;

export const ApiAdvancedMultiStoreSSRPage = () => (
  <DocArticle title="Multi-store/SSR">
    <p className="lead">요청 단위 스토어를 생성하고 렌더러를 연결해 격리된 다이얼로그 스택을 운용합니다.</p>

    <Section as="h2" id="definition" title="Definition/Signature">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>스토어는 전역 싱글턴일 필요가 없습니다.</li>
        <li>스토어별로 렌더러를 연결해야 컨트롤러 컨텍스트가 올바르게 주입됩니다.</li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="Examples">
      <CodeBlock language="ts" code={guideline} />
      <CodeBlock language="tsx" code={withRenderer} />
    </Section>

    <Section as="h2" id="notes" title="Notes">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>요청 스코프 외부 공유를 피하고 필요한 범위에서만 주입하세요.</li>
      </ul>
    </Section>
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/fundamentals/architecture', label: '핵심 개념 → 아키텍처 개요' },
          { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
        ]}
      />
    </Section>
  </DocArticle>
);
