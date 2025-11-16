import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const registrySignature = `function createDialogApi<TRegistry extends Record<string, any>>(
  store: DialogStore,
  registry: TRegistry
): DialogApi<NormalizeRegistry<TRegistry>>;

type DialogApi<T> = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['update'];
} & {
  [K in keyof T]: DialogMethodFromDefinition<T[K]>;
};`;

const exampleRegistry = `const dialog = createDialogApi(new DialogStore(), {
  alert: { component: Alert }, // sync → store.open
  confirm: { component: Confirm, mode: 'async' }, // async → store.openAsync
});

dialog.alert({ title: '안내', message: '완료되었습니다' });
const result = await dialog.confirm((c) => ({
  title: '삭제',
  onConfirm: () => c.resolve?.({ ok: true }),
  onCancel: () => c.resolve?.({ ok: false }),
}));`;

export const ApiCreateDialogApiPage = () => (
  <DocArticle title="createDialogApi (API)">
    <p className="lead">
      스토어와 레지스트리를 매핑해 키별 고수준 메서드를 생성합니다. 모드에 따라 <InlineCode>open</InlineCode> 또는 <InlineCode>openAsync</InlineCode>로 자동 분기합니다.
    </p>

    <Section as="h2" id="signature" title="정의/시그니처">
      <CodeBlock language="ts" code={registrySignature} />
    </Section>

    <Section as="h2" id="mapping" title="동작 보증">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>mode: &apos;sync&apos;</InlineCode> → 동기 핸들 반환(<InlineCode>DialogOpenResult</InlineCode>).</li>
        <li><InlineCode>mode: &apos;async&apos;</InlineCode> → Promise로 감싼 결과 반환(<InlineCode>DialogAsyncResult</InlineCode>).</li>
        <li>레지스트리 항목은 객체 또는 <InlineCode>defineDialog</InlineCode> 정의를 모두 지원.</li>
        <li>생성된 API는 기본 스토어 메서드(<InlineCode>open/close/update</InlineCode> 등)도 그대로 노출.</li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="ts" code={exampleRegistry} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>컨트롤러 팩토리 입력을 지원해 내부에서 <InlineCode>resolve/reject</InlineCode> 사용 가능.</li>
        <li>정의에 <InlineCode>displayName</InlineCode>을 설정하면 디버깅 시 컴포넌트 식별이 용이.</li>
      </ul>
    </Section>
  </DocArticle>
);
