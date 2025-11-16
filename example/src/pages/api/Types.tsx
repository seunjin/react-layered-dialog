import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const openAsyncTypes = `export type DialogOpenResult<TProps = Record<string, unknown>> = {
  dialog: OpenDialogResult;
  close: () => void;
  unmount: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  setStatus: (status: DialogStatus) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  zIndex: number;
};

export type DialogAsyncResult<TProps = Record<string, unknown>> = DialogOpenResult<TProps> & {
  ok: boolean;
};`;

const controllerType = `export interface DialogControllerContextValue<TProps = Record<string, unknown>> {
  id: DialogId;
  isOpen: boolean;
  state: TProps;
  zIndex: number;
  handle: OpenDialogResult;
  stack: { topId: DialogId | null; size: number; index: number };
  close(): void; unmount(): void; closeAll(): void; unmountAll(): void;
  update(updater: DialogStateUpdater<TProps>): void;
  getStateField<V>(key: PropertyKey, fallback: V): V;
  getStateFields<B extends Record<string, unknown>>(base: B): B;
  resolve?(payload: { ok: boolean }): void; reject?(reason?: unknown): void;
  status: DialogStatus; getStatus(): DialogStatus; setStatus(status: DialogStatus): void;
}`;

const entrySnapshot = `export interface DialogEntry {
  id: DialogId;
  renderer: DialogRenderFn;
  componentKey: string;
  isOpen: boolean;
  isMounted: boolean;
  zIndex: number;
  state: Record<string, unknown>;
  asyncHandlers?: { resolve: (payload: { ok: boolean }) => void; reject: (reason?: unknown) => void };
  meta: { status: DialogStatus };
}

export interface DialogStoreSnapshot { entries: DialogEntry[] }`;

const statusUpdaterOptions = `export type DialogStatus = 'idle' | 'loading' | 'done' | 'error';

export type DialogStateUpdater<TProps = Record<string, unknown>> =
  | TProps
  | Partial<TProps>
  | ((prev: TProps) => TProps | Partial<TProps> | null | undefined);

export type OpenDialogOptions = {
  id?: DialogId;
  zIndex?: number;
  componentKey?: string;
};`;

export const ApiTypesPage = () => (
  <DocArticle title="Types (API)">
    <p className="lead">핵심 타입 시그니처를 한 곳에 모았습니다. 호출부와 컴포넌트 구현에서 참조하세요.</p>

    <Section as="h2" id="open-async" title="OpenResult / AsyncResult">
      <CodeBlock language="ts" code={openAsyncTypes} />
    </Section>

    <Section as="h2" id="controller" title="DialogControllerContextValue">
      <CodeBlock language="ts" code={controllerType} />
    </Section>

    <Section as="h2" id="entry-snapshot" title="DialogEntry / DialogStoreSnapshot">
      <CodeBlock language="ts" code={entrySnapshot} />
    </Section>

    <Section as="h2" id="status-updater-options" title="Status / Updater / Options">
      <CodeBlock language="ts" code={statusUpdaterOptions} />
      <p className="mt-2 text-sm text-muted-foreground">
        상태 우선순위: 컴포넌트 내부 <InlineCode>state</InlineCode> → 호출 시 전달한 props → 기본값 순으로 해석하세요.
      </p>
    </Section>
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/fundamentals/dialog-store', label: '핵심 개념 → DialogStore' },
          { to: '/fundamentals/use-dialog-controller', label: '핵심 개념 → useDialogController' },
          { to: '/building-dialogs/defining', label: '구현 가이드 → 다이얼로그 타입 설계' },
        ]}
      />
    </Section>
  </DocArticle>
);
  
