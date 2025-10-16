import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const managerMethods = `import type {
  DialogHandle,
  DialogPatch,
  DialogState,
} from 'react-layered-dialog';

type DialogManager<T extends { type: string }> = {
  subscribe(listener: () => void): () => void;
  getSnapshot(): DialogState<T>[];
  getServerSnapshot(): DialogState<T>[];
  openDialog(state: T & { id?: string }): DialogHandle<T['type']>;
  closeDialog(id?: string): void;
  closeAllDialogs(): void;
  updateDialog<K extends T['type']>(
    handle: DialogHandle<K>,
    nextState:
      | DialogPatch<Extract<T, { type: K }>>
      | ((prev: DialogState<Extract<T, { type: K }>>) => DialogPatch<Extract<T, { type: K }>> | null | undefined)
  ): DialogState<Extract<T, { type: K }>> | null;
};`;

export const DialogManagerApi = () => (
  <DocArticle title="DialogManager API">
    <p className="lead">
      <InlineCode>DialogManager</InlineCode>는 순수한 스토어입니다. 상태 배열을 직접 노출하며,
      React 외부에서도 재사용할 수 있습니다.
    </p>

    <Section as="h2" id="shape" title="타입">
      <CodeBlock language="ts" code={managerMethods} />
    </Section>

    <Section as="h2" id="notes" title="동작 노트">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>subscribe</InlineCode>는 <InlineCode>useSyncExternalStore</InlineCode>와 호환되도록
          설계되었습니다. React 환경이 아니어도 사용할 수 있습니다.
        </li>
        <li>
          <InlineCode>openDialog</InlineCode>는 <InlineCode>{'{ id, type }'}</InlineCode> 형태의 핸들을 반환합니다. 중복 ID를 열면 경고만 출력하고 기존 항목은 덮어쓰지 않습니다.
        </li>
        <li>
          <InlineCode>DialogHandle</InlineCode>과 <InlineCode>DialogPatch</InlineCode>는
          <InlineCode>react-layered-dialog</InlineCode>에서 타입으로 제공됩니다. 필요하면 직접 정의한 상태 유니온에 맞춰 제네릭을 지정하세요.
        </li>
        <li>
          <InlineCode>updateDialog</InlineCode>는 상태를 병합할 뿐, 값 검증이나 파생 상태 계산을 수행하지 않습니다.
        </li>
        <li>
          <InlineCode>zIndex</InlineCode>는 기본적으로 <InlineCode>baseZIndex</InlineCode>부터 1씩 증가합니다. 직접 값을 넣으면
          그 다음 자동 값은 항상 더 큰 숫자가 됩니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
