import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const propsSnippet = `// TProps: 다이얼로그 UI를 구성하는 데이터와 콜백
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
};

// TOptions: 선택적으로 분리한 행동 옵션 (간단한 경우 props에 포함해도 됩니다)
export type DialogBehaviorOptions = {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};`;

const registrySnippet = `import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

const dialog = createDialogApi(new DialogStore(), {
  alert: { component: Alert },
  confirm: { component: Confirm, mode: 'async' },
});`;

export const DefiningDialogsPage = () => (
  <DocArticle title="다이얼로그 타입 설계">
    <p className="lead">
      다이얼로그마다 필요한 데이터 구조(<InlineCode>TProps</InlineCode>)와 동작
      옵션(<InlineCode>TOptions</InlineCode>)을 명확히 분리해 두면, 레지스트리와
      컨트롤러/렌더러 전반에서 타입 안전한 계약을 유지할 수 있습니다.
    </p>

    <Section as="h2" id="props" title="Props & 옵션 정의">
      <p>
        다이얼로그 UI에 필요한 데이터(<InlineCode>TProps</InlineCode>)와 행동을
        제어하는 옵션(<InlineCode>TOptions</InlineCode>)을 분리해 두면
        컨트롤러/렌더러 전반에서 계약이 선명해집니다. 물론 규칙상 반드시
        분리해야 하는 것은 아니며, 단순한 경우라면 옵션 필드를{' '}
        <InlineCode>TProps</InlineCode>에 포함시켜도 됩니다.
      </p>
      <CodeBlock language="ts" code={propsSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          다이얼로그 유형은 레지스트리 키나{' '}
          <InlineCode>store.open&lt;TProps, TOptions&gt;()</InlineCode>{' '}
          호출부에서 결정되므로 props 타입에는 UI에 필요한 데이터만 선언하면
          됩니다.
        </li>
        <li>
          옵션 타입을 따로 두면 컨트롤러의 <InlineCode>options</InlineCode> 값이
          명확해지고, 렌더러에서 전역 동작을 분기하기 쉬워집니다. 필요 없다면
          옵션 필드를 <InlineCode>TProps</InlineCode>에 포함시켜{' '}
          <InlineCode>getStateFields</InlineCode>로 다뤄도 됩니다.
        </li>
        <li>
          제네릭 관점에서 <InlineCode>AlertDialogProps</InlineCode>가{' '}
          <InlineCode>TProps</InlineCode>,{' '}
          <InlineCode>DialogBehaviorOptions</InlineCode>가{' '}
          <InlineCode>TOptions</InlineCode>의 역할을 수행합니다. 이후{' '}
          <InlineCode>DialogComponent&lt;TProps, TOptions&gt;</InlineCode>,{' '}
          <InlineCode>useDialogController&lt;TProps, TOptions&gt;</InlineCode>
          에서 동일한 조합으로 사용됩니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="registry" title="createDialogApi 레지스트리">
      <p>
        <InlineCode>createDialogApi</InlineCode>에 레지스트리를 전달하면 각
        키마다 전용 메서드가 생성되고, props/옵션 타입이 자동으로 좁혀집니다.
      </p>
      <CodeBlock language="ts" code={registrySnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>mode: &apos;async&lsquo;</InlineCode>를 지정하면 Promise
          기반 메서드가 만들어져 <InlineCode>await dialog.confirm()</InlineCode>{' '}
          흐름을 바로 사용할 수 있습니다.
        </li>
        <li>
          필요한 경우 <InlineCode>displayName</InlineCode>을 지정해 개발자
          도구에서 컴포넌트를 쉽게 구분하세요.
        </li>
        <li>
          레지스트리 정의만으로 메서드 시그니처가 결정되므로,{' '}
          <InlineCode>typeof dialog.alert</InlineCode>처럼 IDE에서 곧바로 타입을
          확인할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section
      as="h2"
      id="dialog-component"
      title="DialogComponent 제네릭과 컨트롤러"
    >
      <p>
        컴포넌트를 만들 때{' '}
        <InlineCode>DialogComponent&lt;TProps, TOptions&gt;</InlineCode> 형태로
        선언하면 레지스트리와 컨트롤러가 동일한 타입 정보를 공유합니다. 컨트롤러
        훅도{' '}
        <InlineCode>useDialogController&lt;TProps, TOptions&gt;</InlineCode>처럼
        같은 제네릭을 사용해 <InlineCode>getStateFields</InlineCode>,{' '}
        <InlineCode>options</InlineCode> 등에서 정확한 자동 완성을 받을 수
        있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        옵션을 분리하지 않는 경우라면{' '}
        <InlineCode>DialogComponent&lt;AlertDialogProps, void&gt;</InlineCode>
        처럼 <InlineCode>TOptions</InlineCode> 자리에
        <InlineCode>void</InlineCode> 또는 <InlineCode>undefined</InlineCode>를
        넣어도 됩니다.
      </p>
    </Section>

    <Section as="h2" id="generics" title="열기 메서드에서의 제네릭 명시">
      <p>
        대부분의 경우 레지스트리 정보만으로 타입이 추론되지만, 필요하다면{' '}
        <InlineCode>dialog.store.open</InlineCode> /
        <InlineCode>openAsync</InlineCode> 호출 시{' '}
        <InlineCode>
          open&lt;AlertDialogProps, DialogBehaviorOptions&gt;(...)
        </InlineCode>
        처럼 제네릭을 명시해 컨트롤러 메서드(
        <InlineCode>getStateFields</InlineCode>,{' '}
        <InlineCode>options</InlineCode>)의 타입을 정확히 고정할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        특히 커스텀 <InlineCode>DialogRenderFn</InlineCode>을 구성하거나
        레지스트리 밖에서 스토어를 직접 사용할 때는 제네릭을 명시해 props/옵션
        타입이 의도대로 추론되는지 확인하세요.
      </p>
    </Section>

    <Section as="h2" id="async" title="비동기 계약 설계">
      <p>
        비동기 다이얼로그는 레지스트리에서{' '}
        <InlineCode>mode: &apos;async&lsquo;</InlineCode>만 추가하면 됩니다.
        컨트롤러에서는 <InlineCode>resolve</InlineCode>/
        <InlineCode>reject</InlineCode>를 호출해 Promise를 종료하고, 호출자는
        자연스럽게 <InlineCode>await</InlineCode>로 결과를 다룰 수 있습니다.
      </p>
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          반환된 컨트롤러에는 <InlineCode>setStatus</InlineCode>,{' '}
          <InlineCode>update</InlineCode>가 포함되므로 로딩 상태와 후속
          애니메이션을 쉽게 구성할 수 있습니다.
        </li>
        <li>
          props 타입에 비동기 결과 계약(예: 반드시{' '}
          <InlineCode>resolve</InlineCode> 호출 여부)을 명시해 두면 컴포넌트와
          호출부가 일관된 규칙을 공유할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="tips" title="설계 팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          옵션(예: <InlineCode>scrollLock</InlineCode>)과 컴포넌트 내부 상태(예:{' '}
          <InlineCode>step</InlineCode>)를 명확히 구분하면 업데이트 로직이
          단순해집니다. 옵션은 <InlineCode>TOptions</InlineCode>로 정의해
          컨트롤러 <InlineCode>options</InlineCode>로 전달하거나, 필요하다면
          props에 포함해 <InlineCode>getStateFields</InlineCode>로 다룰 수도
          있습니다.
        </li>
        <li>
          레지스트리 키를 폴더 구조와 일관되게 유지하면 탐색이 쉬워집니다.
        </li>
        <li>
          컨트롤러 메서드에서 타입 추론이 필요할 경우{' '}
          <InlineCode>
            dialog.store.open&lt;AlertDialogProps,
            DialogBehaviorOptions&gt;(...)
          </InlineCode>
          처럼 제네릭을 명시해 정확도를 높일 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          실제 컴포넌트 구현 패턴은 <InlineCode>컴포넌트 기본기</InlineCode>{' '}
          페이지에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
