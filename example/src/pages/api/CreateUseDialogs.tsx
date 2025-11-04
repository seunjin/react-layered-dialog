import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `createDialogApi<T extends Record<string, DialogDefinition | DialogConfig>>(
  store: DialogStore,
  registry: T
): DialogApi<T>`;

const example = `import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

type AlertProps = { title: string; message: string };
type ConfirmProps = { title: string; message: string; onConfirm: () => void };

const dialogStore = new DialogStore();

const dialog = createDialogApi(dialogStore, {
  alert: { component: Alert },
  confirm: { component: Confirm, mode: 'async' },
} as const);

dialog.alert({ title: '안내', message: 'Sync 다이얼로그' });

const result = await dialog.confirm((controller) => ({
  title: '정말 삭제할까요?',
  message: '이 작업은 되돌릴 수 없습니다.',
  onConfirm: () => controller.resolve?.({ ok: true }),
  onCancel: () => controller.resolve?.({ ok: false }),
}));`;

export const CreateUseDialogs = () => (
  <DocArticle title="createDialogApi">
    <p className="lead">
      <InlineCode>createDialogApi</InlineCode>는 레지스트리를 기반으로 타입 안전한
      고수준 메서드를 생성합니다. 레지스트리에 등록한 각 키마다 동기 또는 비동기
      open 함수가 자동으로 만들어지며, 기본 스토어 조작 메서드도 함께 제공됩니다.
    </p>

    <Section as="h2" id="signature" title="시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="registry" title="레지스트리 구성">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          값으로 <InlineCode>{'{ component, mode }'}</InlineCode> 객체를 전달하면
          간단하게 등록할 수 있습니다. <InlineCode>mode</InlineCode> 기본값은{' '}
          <InlineCode>&apos;sync&apos;</InlineCode>이며 <InlineCode>&apos;async&apos;</InlineCode>로 지정하면
          <InlineCode>openAsync</InlineCode> 기반 메서드가 생성됩니다.
        </li>
        <li>
          더 세밀한 제어가 필요하면 <InlineCode>defineDialog</InlineCode>로 컴포넌트를
          감싼 뒤 레지스트리에 넣을 수 있습니다. displayName 등을 명시적으로 설정하고 싶을 때 유용합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="ts" code={example} />
      <p className="mt-2 text-sm text-muted-foreground">
        반환된 객체에는 <InlineCode>open</InlineCode>, <InlineCode>close</InlineCode>,
        <InlineCode>closeAll</InlineCode>, <InlineCode>update</InlineCode> 같은 기본 메서드도 포함됩니다.
        필요하다면 그대로 export하여 애플리케이션 전역에서 재사용하세요.
      </p>
    </Section>
  </DocArticle>
);
