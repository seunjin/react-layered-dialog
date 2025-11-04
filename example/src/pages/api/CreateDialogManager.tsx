import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `class DialogStore {
  constructor(baseZIndex?: number);

  open<TProps, TOptions>(renderer: DialogRenderFn<TProps, TOptions>, options?: OpenDialogOptions<TOptions>): DialogOpenResult<TProps, TOptions>;
  openAsync<TProps, TOptions>(renderer: DialogRenderFn<TProps, TOptions>, options?: OpenDialogOptions<TOptions>): Promise<DialogAsyncResult<TProps, TOptions>>;

  close(id?: DialogId): void;
  unmount(id?: DialogId): void;
  closeAll(): void;
  unmountAll(): void;

  updateState<TProps>(id: DialogId, updater: DialogStateUpdater<TProps>): void;
  setStatus(id: DialogId, status: DialogStatus): void;
  getStatus(id: DialogId): DialogStatus;

  subscribe(listener: DialogListener): () => void;
  getSnapshot(): DialogStoreSnapshot;
}`;

const example = `import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';

export const dialogStore = new DialogStore(2000);

const dialog = createDialogApi(dialogStore, {
  alert: { component: Alert },
});

export const openDialog = dialog.open;
export const closeDialog = dialog.close;

// anywhere in the app
openDialog('alert', {
  title: '안내',
  message: '스토어는 전역에서 공유됩니다.',
});`;

export const CreateDialogManager = () => (
  <DocArticle title="DialogStore">
    <p className="lead">
      <InlineCode>DialogStore</InlineCode>는 다이얼로그 스택과 메타 데이터를 관리하는
      경량 클래스입니다. z-index 계산, 비동기 흐름, 상태 업데이트 같은 핵심 기능을
      제공하고, UI 렌더링은 애플리케이션이 담당합니다.
    </p>

    <Section as="h2" id="signature" title="주요 메서드">
      <CodeBlock language="ts" code={signature} />
      <p className="mt-2 text-sm text-muted-foreground">
        생성자에 <InlineCode>baseZIndex</InlineCode>를 전달하면 자동으로 증가하는 z-index
        시작 값을 지정할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="ts" code={example} />
      <p className="mt-2 text-sm text-muted-foreground">
        대부분의 애플리케이션은 스토어를 한 번만 생성해 전역으로 공유하고,
        <InlineCode>createDialogApi</InlineCode>를 통해 타입 안전한 헬퍼를 파생시킵니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          스토어는 클래스 형태지만 React 상태와 무관하므로 어디서든 생성할 수 있습니다.
          서버 환경에서 SSR이 필요하다면 요청마다 새로운 인스턴스를 만들어 사용하세요.
        </li>
        <li>
          <InlineCode>subscribe</InlineCode>/<InlineCode>getSnapshot</InlineCode> 쌍은
          <InlineCode>useSyncExternalStore</InlineCode>와 바로 호환되도록 설계되었습니다.
        </li>
        <li>
          비동기 확인 모달처럼 <InlineCode>openAsync</InlineCode> 이후 상태를 추적해야 한다면
          반환된 컨트롤러의 <InlineCode>status</InlineCode>와 <InlineCode>update</InlineCode> 메서드를 활용하세요.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
