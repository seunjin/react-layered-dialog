import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const signature = `function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>
>(): DialogControllerContextValue<TProps>;`;

const fields = `type DialogControllerContextValue<TProps> = {
  id: DialogId;
  isOpen: boolean;
  state: TProps;
  zIndex: number;
  handle: OpenDialogResult;
  stack: { topId: DialogId | null; size: number; index: number };
  close(): void;
  unmount(): void;
  closeAll(): void;
  unmountAll(): void;
  update(updater: DialogStateUpdater<TProps>): void;
  getStateField<V>(key: PropertyKey, fallback: V): V;
  getStateFields<B extends Record<string, unknown>>(base: B): B;
  resolve?(payload: { ok: boolean }): void;
  reject?(reason?: unknown): void;
  status: DialogStatus;
  getStatus(): DialogStatus;
  setStatus(status: DialogStatus): void;
};`;

const usage = `function Alert(props: { title: string; message: string }) {
  const { close, unmount, zIndex, getStateFields, isOpen } = useDialogController<typeof props>();
  const { title, message } = getStateFields(props);
  return (
    <div className={isOpen ? 'animate-in' : 'animate-out'} style={{ zIndex }}>
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={() => { close(); setTimeout(() => unmount(), 200); }}>확인</button>
    </div>
  );
}`;

export const ApiUseDialogControllerPage = () => (
  <DocArticle title="useDialogController (API)">
    <p className="lead">다이얼로그 컴포넌트 내부에서 상태·제어 함수·스택 메타를 제공하는 컨트롤러 훅입니다.</p>

    <Section as="h2" id="signature" title="정의/시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="controller-fields" title="컨트롤러 항목">
      <CodeBlock language="ts" code={fields} />
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="tsx" code={usage} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>getStateFields</InlineCode>로 props와 내부 상태를 병합해 안전하게 기본값을 다룹니다.</li>
        <li>비동기 모드에서는 <InlineCode>resolve/reject/status</InlineCode>를 활용해 로딩→완료 흐름을 표현합니다.</li>
      </ul>
    </Section>

    <Section as="h2" id="related" title="관련 문서">
      <DocLinks
        links={[
          { to: '/fundamentals/use-dialog-controller', label: '핵심 개념 → useDialogController' },
          { to: '/building-dialogs/components', label: '구현 가이드 → 컴포넌트 기본기' },
          { to: '/building-dialogs/async-patterns', label: '구현 가이드 → 비동기 & 상태 패턴' },
        ]}
      />
    </Section>
  </DocArticle>
);
