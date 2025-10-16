import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `import type { DialogHandle, DialogState, DialogInstance } from 'react-layered-dialog';

createUseDialogs<T extends { type: string }>(
  manager: DialogManager<T>,
  componentMap: { [K in T['type']]: React.ComponentType<DialogState<Extract<T, { type: K }>>> }
): () => {
  dialogs: readonly DialogInstance<T>[];
  openDialog: <K extends T['type']>(
    type: K,
    payload: Omit<Extract<T, { type: K }>, 'type' | 'id' | 'isOpen'> & { id?: string }
  ) => DialogHandle<K>;
  closeDialog: (id?: string) => void;
  closeAllDialogs: () => void;
  updateDialog: <K extends T['type']>(
    handle: DialogHandle<K>,
    nextState:
      | Partial<Omit<Extract<T, { type: K }>, 'id' | 'type' | 'isOpen'>>
      | ((prev: DialogState<Extract<T, { type: K }>>) => Partial<Omit<Extract<T, { type: K }>, 'id' | 'type' | 'isOpen'>> | null | undefined)
  ) => DialogState<Extract<T, { type: K }>> | null;
}`;

const example = `const { manager } = createDialogManager<AppDialogState>();

export const useDialogs = createUseDialogs(manager, {
  alert: AlertDialog,
  confirm: ConfirmDialog,
});`;

export const CreateUseDialogs = () => (
  <DocArticle title="createUseDialogs">
    <p className="lead">
      매니저와 컴포넌트 맵을 연결하여 커스텀 <InlineCode>useDialogs</InlineCode> 훅을 생성합니다.
      반환된 훅은 다이얼로그 배열과 제어 함수를 제공합니다.
    </p>

    <Section as="h2" id="signature" title="시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="component-map" title="컴포넌트 맵 규칙">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          키는 다이얼로그 <InlineCode>type</InlineCode> 문자열과 동일해야 합니다.
        </li>
        <li>
          값은 해당 타입의 <InlineCode>DialogState</InlineCode>를 props로 받는 React 컴포넌트여야 합니다.
        </li>
        <li>
          다이얼로그 렌더링에 필요한 추가 데이터는 상태 유니온에 직접 포함하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="return" title="반환 값">
      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">dialogs</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            현재 열린 다이얼로그 배열입니다. 렌더러에게 그대로 전달하면 됩니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">openDialog</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            type과 payload를 받아 다이얼로그를 열고 <InlineCode>{'{ id, type }'}</InlineCode> 핸들을 반환합니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">closeDialog / closeAllDialogs</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            스택에서 다이얼로그를 제거합니다. 인자를 생략하면 가장 상단 다이얼로그가 닫힙니다.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">updateDialog</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            부분 객체 또는 콜백을 사용해 이미 열린 다이얼로그를 갱신합니다. <InlineCode>openDialog</InlineCode>가 반환한 핸들을 그대로 전달하세요.
          </dd>
        </div>
      </dl>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="ts" code={example} />
    </Section>
  </DocArticle>
);
