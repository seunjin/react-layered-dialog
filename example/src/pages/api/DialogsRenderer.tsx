import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `type DialogsRendererProps = { store: DialogStore };
function DialogsRenderer({ store }: DialogsRendererProps): JSX.Element;`;

const meta = `// 스택 메타 계산 규칙 (내부 구현 요약)
// 1) isOpen === true 인 항목만 기준으로 최상단/인덱스/개수 계산
// 2) 닫힘(퇴장 중) 항목은 보이지 않는 상태이므로 top 판정에서 제외
`;

const usage = `<DialogsRenderer store={dialog.store} />`;

export const ApiDialogsRendererPage = () => (
  <DocArticle title="DialogsRenderer (API)">
    <p className="lead">스토어 스냅샷을 구독해 등록된 다이얼로그를 DOM에 출력합니다. 컨트롤러 컨텍스트를 각 엔트리에 주입합니다.</p>

    <Section as="h2" id="signature" title="정의/시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="guarantees" title="동작 보증">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>useSyncExternalStore</InlineCode>로 스냅샷을 구독합니다.</li>
        <li>스택 메타는 <InlineCode>isOpen=true</InlineCode> 항목만 기준으로 계산됩니다.</li>
        <li>컨텍스트에는 <InlineCode>close/unmount/update</InlineCode> 등 컨트롤러가 포함됩니다.</li>
      </ul>
      <CodeBlock language="ts" code={meta} />
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="tsx" code={usage} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>여러 스토어를 사용하면 렌더러도 스토어별로 배치해야 컨텍스트가 올바르게 연결됩니다.</li>
      </ul>
    </Section>
  </DocArticle>
);

