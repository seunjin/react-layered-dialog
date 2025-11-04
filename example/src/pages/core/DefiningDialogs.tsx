import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const propsSnippet = `// dialog-types.ts
export type DialogBehaviorOptions = {
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type AlertDialogProps = {
  title: string;
  message: string;
  onOk?: () => void;
};

export type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  step?: 'confirm' | 'loading' | 'done';
};

export type ModalDialogProps = {
  title: string;
  description?: string;
  canDismiss?: boolean;
  onClose?: () => void;
};`;

const registrySnippet = `// dialogs.ts (일부)
import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type {
  AlertDialogProps,
  ConfirmDialogProps,
  ModalDialogProps,
  DialogBehaviorOptions,
} from './dialog-types';

export const dialogStore = new DialogStore();

const registry = {
  alert: { component: Alert },
  confirm: { component: Confirm, mode: 'async' },
  modal: {
    component: Modal,
    // 디스플레이 이름을 지정할 수 있습니다.
    displayName: 'AppModal',
  },
} as const;

export const dialogApi = createDialogApi(dialogStore, registry);

// 구체적인 타입이 필요한 경우
type AlertMethod = typeof dialogApi.alert;
type AlertOptions = Parameters<AlertMethod>[1]; // OpenDialogOptions<DialogBehaviorOptions>`;

export const DefiningDialogs = () => (
  <DocArticle title="다이얼로그 타입 설계">
    <p className="lead">
      새 API에서는 다이얼로그마다 필요한 props 타입과 공통 동작 옵션을 분리해 정의합니다.
      상태 스택과 메타 데이터는 <InlineCode>DialogStore</InlineCode>가 담당하므로,
      각 다이얼로그가 받아야 할 데이터에 집중할 수 있습니다.
    </p>

    <Section as="h2" id="props" title="1. Props & 옵션 정의">
      <p>
        다이얼로그별로 필요한 필드를 명시적으로 선언하고, dim/ESC/스크롤락 같이
        공통으로 다룰 동작은 <InlineCode>DialogBehaviorOptions</InlineCode>처럼 별도 타입으로 관리합니다.
      </p>
      <CodeBlock language="ts" code={propsSnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        props 타입은 단순한 객체 형태로 유지하는 편이 좋습니다. 외부에서{' '}
        <InlineCode>openDialog(&apos;alert&apos;, props)</InlineCode> 형태로 호출하기 때문에
        <InlineCode>type</InlineCode> 필드를 포함시킬 필요가 없습니다.
      </p>
    </Section>

    <Section as="h2" id="registry" title="2. 레지스트리 연결">
      <p>
        <InlineCode>createDialogApi</InlineCode>는 스토어와 레지스트리를 묶어 타입 안전한 헬퍼를 생성합니다.
        등록된 키마다 <InlineCode>dialogApi.alert</InlineCode>처럼 전용 메서드가 생기며,
        props/옵션 타입이 자동으로 좁혀집니다.
      </p>
      <CodeBlock language="ts" code={registrySnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        메서드 시그니처가 궁금하다면 <InlineCode>typeof dialogApi.alert</InlineCode>처럼 TypeScript 유틸리티를 활용해
        곧바로 추론된 타입을 확인할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        <InlineCode>mode: &apos;async&apos;</InlineCode>로 등록하면 자동으로 Promise 기반 메서드가 생성됩니다.
        정의 시점에서 displayName을 지정해 개발자 도구에서 구분하기 쉽게 만들 수도 있습니다.
      </p>
    </Section>

    <Section as="h2" id="async" title="3. 비동기 다이얼로그 설계">
      <p>
        비동기 다이얼로그는 <InlineCode>mode: &apos;async&apos;</InlineCode> 하나만 추가하면 됩니다.
        컨트롤러 쪽에서는 <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>를 호출할 수 있고,
        호출부에서는 <InlineCode>await dialog.confirm()</InlineCode>처럼 자연스럽게 결과를 사용할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        비동기 결과 객체에는 <InlineCode>status</InlineCode>, <InlineCode>setStatus</InlineCode>,
        <InlineCode>update</InlineCode> 등이 포함되므로 로딩 상태와 후속 애니메이션을 쉽게 구성할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="4. 설계 팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <b>옵션과 상태를 분리</b>: 스토어 옵션(예: <InlineCode>scrollLock</InlineCode>)과
          컴포넌트 내부 상태(예: <InlineCode>step</InlineCode>)를 명확히 구분하면 업데이트 로직이 단순해집니다.
        </li>
        <li>
          <b>비동기 계약 정의</b>: <InlineCode>mode: &apos;async&apos;</InlineCode> 다이얼로그는 컨트롤러의
          <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>를 언제 호출할지 props 타입에 명시해 두면 좋습니다.
        </li>
        <li>
          <b>레이어 이름</b>: <InlineCode>type</InlineCode> 이름을 폴더 구조와 맞춰 두면 레지스트리와 컴포넌트 탐색이 단순합니다.
          예) <InlineCode>renewal.confirm</InlineCode>, <InlineCode>marketing.modal</InlineCode>.
        </li>
        <li>
          <b>폴더 구조와 type 이름을 일치</b>시키면 레지스트리와 컴포넌트 탐색이 쉬워집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
