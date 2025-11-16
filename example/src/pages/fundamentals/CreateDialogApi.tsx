import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const registryExample = `import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

const dialog = createDialogApi(new DialogStore(), {
  alert: { component: Alert },
  confirm: { component: Confirm, mode: 'async' },
});

dialog.alert({ title: '안내', message: 'Sync 다이얼로그' });
`;

const controllerFactoryExample = `const result = await dialog.confirm((controller) => ({
  title: '정말 삭제할까요?',
  message: '이 작업은 되돌릴 수 없습니다.',
  onConfirm: () => controller.resolve?.({ ok: true }),
  onCancel: () => controller.resolve?.({ ok: false }),
}));

if (result.ok) {
  // 사용자 응답 처리
}`;

const defineDialogExample = `import { defineDialog } from 'react-layered-dialog';
import { LiveConfirm } from '@/components/dialogs/LiveConfirm';

const ConfirmDefinition = defineDialog(LiveConfirm, {
  mode: 'async',
  displayName: 'LiveConfirmDialog',
});

const dialog = createDialogApi(new DialogStore(), {
  confirm: ConfirmDefinition,
});`;

export const CreateDialogApiPage = () => (
  <DocArticle title="createDialogApi">
    <p className="lead">
      <InlineCode>createDialogApi</InlineCode>는 <InlineCode>DialogStore</InlineCode>와 레지스트리를 연결해
      타입 안전한 호출 헬퍼를 생성합니다. 이 문서는 개념과 활용 포인트에 집중합니다.
      상세 시그니처는 API 문서를 참고하세요.
    </p>

    <Section as="h2" id="overview" title="Overview">
      <ul className="ml-6 list-disc space-y-2">
        <li>레지스트리 키 → 컴포넌트 매핑으로 팀/도메인 용어 기반 API를 구성합니다.</li>
        <li>
          <InlineCode>mode</InlineCode>에 따라 동기(<InlineCode>open</InlineCode>)/비동기(<InlineCode>openAsync</InlineCode>)가 자동 매핑됩니다.
        </li>
        <li>
          입력은 props 객체 또는 컨트롤러 팩토리 두 가지를 지원합니다.
          팩토리는 내부에서 <InlineCode>resolve/reject</InlineCode>를 사용할 수 있어 선언적 비동기 흐름에 적합합니다.
        </li>
        <li>생성된 객체는 스토어의 기본 제어 함수(<InlineCode>close/unmount/update</InlineCode> 등)도 함께 노출합니다.</li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        자세한 시그니처는 <InlineCode>API → createDialogApi</InlineCode> 문서를 참조하세요.
      </p>
    </Section>

    <Section as="h2" id="registry" title="Registry">
      <p>
        레지스트리는 다이얼로그 타입과 컴포넌트를 매핑하는 단순 객체입니다.
        값으로 <InlineCode>{'{ component, mode }'}</InlineCode> 형태를 전달하면
        즉시 사용 가능하며,
        <InlineCode>mode</InlineCode> 기본값은 <InlineCode>&apos;sync&apos;</InlineCode>입니다.
      </p>
      <CodeBlock language="ts" code={registryExample} />
      <ul className="ml-6 mt-2 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>mode: &apos;async&apos;</InlineCode>로 지정하면 해당 키에 대해 Promise를 반환하는
          메서드가 생성됩니다. 이 메서드는 내부적으로 <InlineCode>store.openAsync</InlineCode>에
          대응하며, 반환 타입은 <InlineCode>Promise&lt;DialogAsyncResult&lt;TProps&gt;&gt;</InlineCode>입니다.
          기본값인 <InlineCode>mode: &apos;sync&apos;</InlineCode>는 <InlineCode>store.open</InlineCode>에
          대응해 <InlineCode>DialogOpenResult&lt;TProps&gt;</InlineCode>를 반환합니다.
        </li>
        <li>
          반환된 <InlineCode>dialog</InlineCode> 객체에는 <InlineCode>open</InlineCode>,
          <InlineCode>openAsync</InlineCode>, <InlineCode>close</InlineCode>,
          <InlineCode>unmount</InlineCode>, <InlineCode>closeAll</InlineCode>,
          <InlineCode>unmountAll</InlineCode>, <InlineCode>update</InlineCode> 같은 기본 제어 함수도 함께 포함됩니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="inputs" title="Inputs">
      <p>
        생성된 메서드는 props 객체를 직접 전달하거나 컨트롤러를 인자로 받는
        팩토리를 전달하는 두 가지 방식을 모두 지원합니다. 컨트롤러 팩토리를
        사용하면 비동기 흐름을 선언적으로 구성할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={controllerFactoryExample} />
      <p className="mt-2 text-sm text-muted-foreground">
        컨트롤러 팩토리는 <InlineCode>close</InlineCode>,{' '}
        <InlineCode>unmount</InlineCode>,<InlineCode>update</InlineCode>,{' '}
        <InlineCode>resolve</InlineCode> 등을 바로 사용할 수 있는 컨텍스트를
        제공합니다.
      </p>
    </Section>

    <Section as="h2" id="define-dialog" title="Using defineDialog">
      <p>
        더 세밀하게 옵션을 지정하고 싶다면 <InlineCode>defineDialog</InlineCode>
        로 컴포넌트를 감싼 뒤 레지스트리에 등록할 수 있습니다. displayName을
        지정하거나 모드를 명시적으로 선언할 때 유용합니다.
      </p>
      <CodeBlock language="ts" code={defineDialogExample} />
    </Section>

    <Section as="h2" id="export" title="Export Patterns">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          대부분의 프로젝트는 <InlineCode>dialog</InlineCode> 객체를 그대로
          export해 앱 전역에서 재사용합니다.
        </li>
        <li>
          필요하면 <InlineCode>dialog.open</InlineCode> 같은 기본 메서드만 따로
          export해 커스텀 훅이나 서비스에서 사용하세요.
        </li>
        <li>
          여러 스토어를 병행한다면 레지스트리도 스토어별로 분리해 독립적인 API를
          만들 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="tips" title="Tips">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          레지스트리에 새로운 타입을 추가하면 관련 메서드 시그니처가 즉시
          업데이트 됩니다. IDE 자동 완성을 통해 props와 옵션 타입을 바로 확인할
          수 있습니다.
        </li>
        <li>
          async 모드에서 반환된 Promise는 컨트롤러의{' '}
          <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>가
          호출될 때까지 유지됩니다. 다이얼로그 내부에서{' '}
          <InlineCode>setStatus</InlineCode>로 상태를 업데이트하면 진행 상황을
          UI에 반영하기 쉽습니다.
        </li>
        <li>
          displayName이나 커스텀 옵션이 필요한 경우{' '}
          <InlineCode>defineDialog</InlineCode>로 래핑한 정의를 재사용하세요.
        </li>
      </ul>
    </Section>
    <Section as="h2" id="api-links" title="API Docs">
      <DocLinks
        links={[
          { to: '/api/create-dialog-api', label: 'API → createDialogApi' },
          { to: '/api/define-dialog', label: 'API → defineDialog' },
        ]}
      />
    </Section>
  </DocArticle>
);
