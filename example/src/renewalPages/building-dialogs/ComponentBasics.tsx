import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const basicComponentSnippet = `import type { DialogComponent } from 'react-layered-dialog';
import { useDialogController } from 'react-layered-dialog';
import type { AlertDialogProps, DialogBehaviorOptions } from '@/lib/dialogs';

export const AlertDialog: DialogComponent<AlertDialogProps, DialogBehaviorOptions> = (props) => {
  const controller = useDialogController<AlertDialogProps, DialogBehaviorOptions>();
  const { close, unmount, getStateField, getStateFields, options } = controller;

  // 기본값과 props를 병합해 항상 완전한 객체를 유지합니다.
  const { title, message } = getStateFields({
    title: '알림',
    message: props.message,
  });
  // 개별 필드만 필요하다면 getStateField로 fallback을 지정할 수 있습니다.
  const onOk = getStateField('onOk', undefined);

  const handleConfirm = () => {
    onOk?.();
    close();
    unmount();
  };

  return (
    <section
      role="alertdialog"
      aria-modal="true"
      style={{ zIndex: options.zIndex }}
    >
      <header>{title}</header>
      <p>{message}</p>
      <button autoFocus onClick={handleConfirm}>확인</button>
      {/* 옵션은 레지스트리/호출부에서 전달된 값입니다. */}
      {options.closeOnEscape === false && <span>ESC로 닫을 수 없습니다.</span>}
    </section>
  );
};`;

export const ComponentBasicsPage = () => (
  <DocArticle title="다이얼로그 컴포넌트 기본기">
    <p className="lead">
      다이얼로그 컴포넌트는 <InlineCode>useDialogController</InlineCode>를 통해 닫기, 언마운트, 옵션, 스택 정보를 받아
      UI와 상호작용을 정의합니다. props와 옵션을 안전하게 병합하고, 컨트롤러가 제공하는 제어 함수를 적극 활용하세요.
    </p>

    <Section as="h2" id="controller" title="컨트롤러와 props 병합">
      <CodeBlock language="tsx" code={basicComponentSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>getStateFields</InlineCode>로 기본값과 props를 병합하면 <InlineCode>update</InlineCode> 호출 이후에도 전체 형태가 유지되어 안전하게 상태를 갱신할 수 있습니다.
        </li>
        <li>
          특정 필드만 필요하다면 <InlineCode>getStateField(key, fallback)</InlineCode>를 사용해 undefined를 허용하지 않는 값을 쉽게 얻을 수 있습니다.
        </li>
        <li>
          옵션 객체(<InlineCode>options</InlineCode>)에는 레지스트리/호출부에서 전달한 값과 자동 계산된 <InlineCode>zIndex</InlineCode>가 포함되어 있으므로, 스타일과 전역 정책을 제어할 때 활용하세요.
        </li>
        <li>
          컴포넌트를 <InlineCode>DialogComponent&lt;TProps, TOptions&gt;</InlineCode>로 선언하면 레지스트리에 등록할 때 타입이 자동으로 매핑되어 호환성을 보장합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="lifecycle" title="닫기와 언마운트">
      <p>
        <InlineCode>close()</InlineCode>는 다이얼로그를 닫고 <InlineCode>isOpen</InlineCode> 상태를 false로 전환합니다. <InlineCode>unmount()</InlineCode>는 스택에서 엔트리를 제거하고 DOM에서 완전히 사라지게 합니다. 대부분의 경우 두 메서드를 연달아 호출해 UI 잔상을 방지합니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        애니메이션이 필요하다면 <InlineCode>close</InlineCode> 이후에 setTimeout 등으로 <InlineCode>unmount</InlineCode>를 지연시키거나, 렌더러에서 애니메이션이 끝난 시점을 감지한 후 <InlineCode>unmount</InlineCode>를 호출하세요.
      </p>
    </Section>

    <Section as="h2" id="focus" title="포커스와 접근성">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          컨트롤러는 포커스를 자동으로 이동시키지 않습니다. 기본 포커스를 줄 요소에 <InlineCode>autoFocus</InlineCode>를 지정하거나 <InlineCode>useEffect</InlineCode>로 직접 관리하세요.
        </li>
        <li>
          <InlineCode>data-topmost</InlineCode> 같은 속성으로 최상단 여부를 표현하면 CSS나 유틸리티 함수에서 간단히 확인할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          비동기 확인 모달을 구현하려면 <InlineCode>비동기 패턴</InlineCode> 페이지를 참고하세요.
        </li>
        <li>
          옵션 기반 상호작용 제어는 <InlineCode>옵션 & 동작</InlineCode> 페이지에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
