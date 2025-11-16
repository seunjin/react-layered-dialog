import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';

const patterns = `// openAsync 결과와 컨트롤러 status 활용
const result = await dialog.confirm((c) => ({
  title: '삭제 확인',
  onConfirm: async () => {
    c.setStatus('loading');
    try {
      await api.delete();
      c.resolve?.({ ok: true });
      c.setStatus('done');
      c.close();
      setTimeout(() => c.unmount(), 200);
    } catch {
      c.setStatus('error');
    }
  },
  onCancel: () => c.resolve?.({ ok: false }),
}));

if (result.ok) {
  // 호출부 후처리
}`;

const getters = `// status 게터/세터
const h = dialog.store.open(() => <Alert />);
h.setStatus('loading');
const current = h.status; // 게터
const latest = h.getStatus(); // 호출 시점 조회`;

export const ApiAdvancedAsyncStatusPage = () => (
  <DocArticle title="고급: 비동기 상태">
    <p className="lead">status/getStatus/setStatus를 일관되게 사용해 로딩→완료 단계를 표현합니다.</p>

    <Section as="h2" id="definition" title="정의/시그니처">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>DialogStatus</InlineCode>: &apos;idle&apos; | &apos;loading&apos; | &apos;done&apos; | &apos;error&apos;</li>
        <li><InlineCode>setStatus</InlineCode>, <InlineCode>getStatus</InlineCode>, <InlineCode>status</InlineCode> 게터 제공</li>
      </ul>
    </Section>

    <Section as="h2" id="guarantees" title="동작 보증">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>컨트롤러와 호출부 핸들 양쪽에서 동일한 상태 API에 접근할 수 있습니다.</li>
        <li>게터(<InlineCode>status</InlineCode>)는 접근 편의, 함수(<InlineCode>getStatus</InlineCode>)는 최신 값 조회에 유리합니다.</li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="tsx" code={patterns} />
      <CodeBlock language="ts" code={getters} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>컨트롤러 훅 시그니처는 <Link to="/api/use-dialog-controller">API → useDialogController</Link> 참고.</li>
      </ul>
    </Section>
  </DocArticle>
);
