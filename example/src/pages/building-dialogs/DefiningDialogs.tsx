import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const propsSnippet = `// AlertDialogProps가 TProps 역할을 수행합니다.
// 팀 컨벤션에 맞게 자유롭게 설계하세요.
export type AlertDialogProps = {
  title: string;
  message?: string;
  // 필요 시 동작/표시 플래그 및 콜백을 선택적으로 추가
  // e.g. onOk?: () => void; useDim?: boolean; scrollLock?: boolean;
};`;

const registrySnippet = `import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

const dialog = createDialogApi(new DialogStore(), {
  alert: { component: Alert },
  confirm: { component: Confirm, mode: 'async' },
});`;

export const DefiningDialogsPage = () => (
  <DocArticle title="Designing Dialog Types">
    <p className="lead">
      다이얼로그마다 필요한 데이터 구조(<InlineCode>TProps</InlineCode>)를 명확히 정의해 두면,
      레지스트리와 컨트롤러/렌더러 전반에서 타입 안전한 계약을 유지할 수 있습니다.
      동작 플래그도 props 안에서 함께 관리해 <InlineCode>getProps</InlineCode>로 병합하세요.
    </p>

    <Section as="h2" id="props" title="Props Definition">
      <p>
        다이얼로그 UI에 필요한 데이터(<InlineCode>TProps</InlineCode>)를 한 타입으로 묶어두면 컨트롤러/렌더러 전반에서
        계약이 선명해집니다. 표시/동작 관련 플래그가 필요하다면 함께 정의하고, 컴포넌트 내부에서 컨트롤러 도우미(
        <InlineCode>getProps</InlineCode> 등)로 조합해 사용하세요.
      </p>
      <CodeBlock language="ts" code={propsSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          다이얼로그 유형은 레지스트리 키나{' '}
          <InlineCode>store.open&lt;TProps&gt;()</InlineCode>{' '}
          호출부에서 결정되므로 props 타입에는 UI에 필요한 데이터만 선언하면
          됩니다.
        </li>
        <li>
          <InlineCode>AlertDialogProps</InlineCode>가 <InlineCode>TProps</InlineCode> 역할을 수행합니다. 이후
          <InlineCode>DialogComponent&lt;TProps&gt;</InlineCode>, <InlineCode>useDialogController&lt;TProps&gt;</InlineCode>
          에서 동일한 제네릭을 사용해 타입 일관성을 유지하세요.
        </li>
        <li>
          제네릭 관점에서 <InlineCode>AlertDialogProps</InlineCode>가{' '}
          <InlineCode>TProps</InlineCode>의 역할을 수행합니다. 이후{' '}
          <InlineCode>DialogComponent&lt;TProps&gt;</InlineCode>,{' '}
          <InlineCode>useDialogController&lt;TProps&gt;</InlineCode>
          에서 동일한 조합으로 사용됩니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="registry" title="createDialogApi Registry">
      <p>
        <InlineCode>createDialogApi</InlineCode>에 레지스트리를 전달하면 각
        키마다 전용 메서드가 생성되고, props/옵션 타입이 자동으로 좁혀집니다.
      </p>
      <CodeBlock language="ts" code={registrySnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>mode: &apos;async&apos;</InlineCode>를 지정하면 Promise 기반 메서드가 생성되어
          내부적으로 <InlineCode>store.openAsync</InlineCode>에 대응합니다. 반환 타입은
          <InlineCode>Promise&lt;DialogAsyncResult&lt;TProps&gt;&gt;</InlineCode>이며,
          기본값인 <InlineCode>mode: &apos;sync&apos;</InlineCode>는 <InlineCode>store.open</InlineCode>에 대응합니다.
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

    <Section as="h2" id="dialog-component" title="DialogComponent Generics & Controller">
      <p>
        컴포넌트를 만들 때 <InlineCode>DialogComponent&lt;TProps&gt;</InlineCode>{' '}
        형태로 선언하면 레지스트리와 컨트롤러가 동일한 타입 정보를 공유합니다.
        컨트롤러 훅도 <InlineCode>useDialogController&lt;TProps&gt;</InlineCode>처럼
        같은 제네릭을 사용해 <InlineCode>getProps</InlineCode> 등에서 정확한 자동 완성을 받을 수 있습니다.
      </p>
      <CodeBlock
        language="tsx"
        code={`import type { DialogComponent } from 'react-layered-dialog';

type AlertDialogProps = { title: string; message?: string };

// annotate 방식
export const AlertA: DialogComponent<AlertDialogProps> = (props) => null;

// satisfies 방식(값 추론 유지 + 형태 검증)
export const AlertB = ((props: AlertDialogProps) => null) satisfies DialogComponent<AlertDialogProps>;`}
      />
    </Section>

    <Section as="h2" id="generics" title="Generics on Open Methods">
      <p>
        대부분의 경우 레지스트리 정보만으로 타입이 추론되지만, 필요하다면{' '}
        <InlineCode>dialog.store.open</InlineCode> / <InlineCode>dialog.store.openAsync</InlineCode> 호출 시{' '}
        <InlineCode>open&lt;AlertDialogProps&gt;(...)</InlineCode> 처럼 제네릭을
        명시해 컨트롤러 메서드(
        <InlineCode>getProps</InlineCode> 등)의 타입을 정확히 고정할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        특히 커스텀 <InlineCode>DialogRenderFn</InlineCode>을 구성하거나
        레지스트리 밖에서 스토어를 직접 사용할 때는 제네릭을 명시해 props
        타입이 의도대로 추론되는지 확인하세요.
      </p>
    </Section>

    <Section as="h2" id="async" title="Async Contract Design">
      <p>
        비동기 다이얼로그는 레지스트리에서{' '}
        <InlineCode>mode: &apos;async&apos;</InlineCode>만 추가하면 됩니다.
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

    <Section as="h2" id="tips" title="Design Tips">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          입력과 상태를 구분하세요. props는 열기 시점의 입력, 컨트롤러 <InlineCode>update</InlineCode>로 바뀌는 값은
          내부 상태로 다룹니다. 기본값이 필요하다면 읽을 때 <InlineCode>getProps</InlineCode>로 합치면 됩니다.
        </li>
        <li>
          한 다이얼로그는 한 가지 역할에 집중하세요. 여러 단계를 표현할 때는 <InlineCode>step</InlineCode> 같은 필드로
          전이를 명시하거나, 역할이 다르면 별도 다이얼로그로 분리하는 편이 명확합니다.
        </li>
        <li>
          비동기 UX는 상태를 드러내세요. 진행 중에는 <InlineCode>setStatus(&apos;loading&apos;)</InlineCode> 대신 상태 플래그를
          사용하거나, 컨트롤러의 <InlineCode>status</InlineCode>/<InlineCode>getStatus</InlineCode>를 활용해 로딩/완료/오류
          표기를 일관되게 유지합니다. 닫기와 제거는 <InlineCode>close()</InlineCode> → 퇴장 → <InlineCode>unmount()</InlineCode>
          순서를 권장합니다.
        </li>
        <li>
          레이어 규칙을 일관되게 유지하세요. 컨트롤러의 <InlineCode>zIndex</InlineCode>를 사용하면 디자인 시스템과 충돌 없이
          스타일 우선순위를 제어할 수 있습니다.
        </li>
        <li>
          접근성 속성(예: <InlineCode>role</InlineCode>, <InlineCode>aria-modal</InlineCode>)을 명시하고, 포커스 관리는
          프로젝트의 훅/유틸로 보완하세요. 라이브러리는 전역 정책을 강제하지 않습니다.
        </li>
        <li>
          레지스트리 키와 <InlineCode>displayName</InlineCode>은 탐색/디버깅 편의를 위해 안정적으로 유지하세요. 동일한
          <InlineCode>TProps</InlineCode>를 <InlineCode>DialogComponent&lt;TProps&gt;</InlineCode>와{' '}
          <InlineCode>useDialogController&lt;TProps&gt;</InlineCode>에서 재사용하면 타입 일관성이 높아집니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="Next Steps">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          실제 컴포넌트 구현 패턴은 <InlineCode>컴포넌트 기본기</InlineCode>{' '}
          페이지에서 이어집니다.
        </li>
      </ul>
    </Section>
    <Section as="h2" id="api-links" title="API Docs">
      <DocLinks
        links={[
          { to: '/api/create-dialog-api', label: 'API → createDialogApi' },
          { to: '/api/define-dialog', label: 'API → defineDialog' },
          { to: '/api/types', label: 'API → 타입 모음' },
        ]}
      />
    </Section>
  </DocArticle>
);
