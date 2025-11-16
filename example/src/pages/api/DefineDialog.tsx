import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `function defineDialog<
  TProps extends Record<string, unknown>,
  TMode extends 'sync' | 'async' = 'sync'
>(
  component: ComponentType<TProps>,
  options?: { mode?: TMode; displayName?: string }
): DialogDefinition<TProps, TMode>;`;

const usage = `const ConfirmDefinition = defineDialog(Confirm, {
  mode: 'async',
  displayName: 'ConfirmDialog',
});

const dialog = createDialogApi(new DialogStore(), {
  confirm: ConfirmDefinition,
});`;

export const ApiDefineDialogPage = () => (
  <DocArticle title="defineDialog (API)">
    <p className="lead">컴포넌트에 모드/표시 이름 메타를 부여해 레지스트리에서 재사용 가능한 정의를 만듭니다.</p>

    <Section as="h2" id="signature" title="정의/시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="guarantees" title="동작 보증">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>미지정 시 기본 모드는 <InlineCode>&apos;sync&apos;</InlineCode>.</li>
        <li><InlineCode>displayName</InlineCode>이 없으면 컴포넌트의 <InlineCode>displayName/name</InlineCode>를 사용.</li>
        <li>정의는 <InlineCode>createDialogApi</InlineCode> 레지스트리에서 객체 형태와 동일하게 취급됩니다.</li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="ts" code={usage} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>satisfies</InlineCode> 또는 제네릭으로 props 타입을 안정화해 IDE 자동완성을 극대화하세요.</li>
      </ul>
    </Section>
  </DocArticle>
);
