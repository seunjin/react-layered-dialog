import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { DocDefinitionList } from '@/components/docs/DocDefinitionList';

const signature = `class DialogStore {
  constructor(options?: { baseZIndex?: number });

  open<TProps extends Record<string, unknown> = Record<string, unknown>>(
    renderer: DialogRenderFn<TProps>,
    options?: OpenDialogOptions
  ): DialogOpenResult<TProps>;
  openAsync<TProps extends Record<string, unknown> = Record<string, unknown>>(
    renderer: DialogRenderFn<TProps>,
    options?: OpenDialogOptions
  ): Promise<DialogAsyncResult<TProps>>;

  close(id?: DialogId): void;
  unmount(id?: DialogId): void;
  closeAll(): void;
  unmountAll(): void;

  update<TProps extends Record<string, unknown> = Record<string, unknown>>(
    id: DialogId,
    updater: DialogStateUpdater<TProps>
  ): void;
  setStatus(id: DialogId, status: DialogStatus): void;
  getStatus(id: DialogId): DialogStatus;

  subscribe(listener: DialogListener): () => void;
  getSnapshot(): DialogStoreSnapshot;
}`;

const openResult = `type DialogOpenResult<
  TProps extends Record<string, unknown> = Record<string, unknown>
> = {
  dialog: OpenDialogResult; // { id, componentKey }
  close(): void;
  unmount(): void;
  update(updater: DialogStateUpdater<TProps>): void;
  setStatus(status: DialogStatus): void;
  readonly status: DialogStatus;
  getStatus(): DialogStatus;
  zIndex: number;
};`;

const syncAsyncExamples = `// 동기(open): 즉시 제어 핸들을 반환합니다.
const sync = dialog.store.open(() => <Alert title="안내" message="완료되었습니다" />);
sync.update({ message: '다시 시도해 주세요' });
sync.close();

// 비동기(openAsync): Promise를 반환하여 ok로 분기합니다.
const res = await dialog.store.openAsync(() => (
  <Confirm title="삭제" message="정말 삭제할까요?" />
));
if (res.ok) {
  res.setStatus('done');
  res.unmount();
}`;

export const ApiDialogStorePage = () => (
  <DocArticle title="DialogStore (API)">
    <p className="lead">
      다이얼로그 스택과 메타(z-index, 상태)를 관리하는 코어 클래스입니다. 렌더링은 앱 책임이며, 이 스토어는 스택 조작과 구독만 담당합니다.
    </p>

    <Section as="h2" id="definition" title="Definition/Signature">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="guarantees" title="Behavior Guarantees">
      <DocDefinitionList
        items={[
          {
            term: 'close()',
            detail: (
              <>
                Sets <InlineCode>isOpen=false</InlineCode> and keeps DOM for exit animations.
              </>
            ),
          },
          {
            term: 'unmount()',
            detail: <>Removes the entry from the stack. Call after exit transition.</>,
          },
          {
            term: 'zIndex',
            detail: (
              <>
                Starts at <InlineCode>baseZIndex</InlineCode>, increments by 1 on open. If a custom
                value is provided, the internal counter advances to <InlineCode>custom+1</InlineCode> or higher.
              </>
            ),
          },
          {
            term: 'reset',
            detail: (
              <>
                When the stack becomes empty (or on <InlineCode>unmountAll()</InlineCode>),
                <InlineCode>nextZIndex</InlineCode> resets to <InlineCode>baseZIndex</InlineCode>.
              </>
            ),
          },
          {
            term: 'subscribe/getSnapshot',
            detail: <>
              Compatible with <InlineCode>useSyncExternalStore</InlineCode> for safe subscription.
            </>,
          },
        ]}
      />
    </Section>

    <Section as="h2" id="returns" title="Return Shape">
      <CodeBlock language="ts" code={openResult} />
      <p className="mt-2 text-sm text-muted-foreground">
        <InlineCode>openAsync</InlineCode>는 위와 동일한 핸들에 <InlineCode>ok: boolean</InlineCode>을 추가해 Promise로 래핑합니다.
      </p>
    </Section>

    <Section as="h2" id="examples" title="Examples">
      <CodeBlock language="tsx" code={syncAsyncExamples} />
    </Section>

    <Section as="h2" id="notes" title="Notes">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>애니메이션 정책: <InlineCode>close()</InlineCode> → 퇴장 → <InlineCode>unmount()</InlineCode> 순서 권장.</li>
        <li>멀티 스토어/SSR: 요청 단위 인스턴스 생성, 렌더러는 스토어별로 연결.</li>
        <li>z-index 레이어링: 기본값은 1000부터 1씩 증가. 필요 시 옵션으로 시작값 조정.</li>
      </ul>
    </Section>
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/fundamentals/dialog-store', label: '핵심 개념 → DialogStore' },
          { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
          { to: '/building-dialogs/sync-patterns', label: '구현 가이드 → 동기 패턴' },
          { to: '/building-dialogs/async-patterns', label: '구현 가이드 → 비동기 & 상태 패턴' },
        ]}
      />
    </Section>
  </DocArticle>
);
