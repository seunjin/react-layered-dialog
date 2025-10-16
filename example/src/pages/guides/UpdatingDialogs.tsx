import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DemoCard } from '@/components/docs/DemoCard';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';

const updateSnippet = `const { openDialog, updateDialog, closeDialog } = useDialogs();

const handle = openDialog('confirm', {
  title: '삭제 확인',
  message: '이 항목을 삭제하시겠습니까?',
  step: 'confirm',
  onConfirm: () => {
    updateDialog(handle, {
      step: 'loading',
      message: '삭제 작업을 처리하고 있습니다...',
      onConfirm: undefined,
      onCancel: undefined,
      dismissable: false,
      closeOnOutsideClick: false,
    });

    setTimeout(() => {
      updateDialog(handle, {
        step: 'done',
        message: '삭제가 완료되었습니다.',
        onConfirm: () => {
          closeDialog(handle.id);
          return false; // 처리 후 직접 닫은 뒤 false를 반환해 추가 닫힘을 방지합니다.
        },
        onCancel: undefined,
        dismissable: true,
        closeOnOutsideClick: true,
      });
    }, 1200);
    return false; // false를 반환하면 다이얼로그를 닫지 않습니다.
  },
  onCancel: () => closeDialog(handle.id),
});`;

export const UpdatingDialogs = () => (
  <DocArticle title="다이얼로그 상태 업데이트">
    <p className="lead">
      <InlineCode>updateDialog</InlineCode>는 이미 열린 다이얼로그의 payload를 부분 갱신합니다.
      반환값은 업데이트된 다이얼로그 상태이며, 존재하지 않는 핸들을 넘기면 <InlineCode>null</InlineCode>을 반환합니다.
    </p>

    <Section as="h2" id="partial" title="부분 갱신">
      <p>
        객체를 넘기면 해당 필드만 덮어씁니다. 매니저는 병합만 수행하고 값 검증, 기본값 보정 등은 하지 않습니다.
        아래 예시는 Confirm 다이얼로그의 <InlineCode>step</InlineCode>, <InlineCode>message</InlineCode>,
        <InlineCode>dismissable</InlineCode> 값을 단계별로 갱신해 동일한 인스턴스에서 흐름을 이어갑니다.
        첫 번째 <InlineCode>onConfirm</InlineCode>은 <InlineCode>false</InlineCode>를 반환해 다이얼로그를 닫지 않고,
        후속 단계에서 다시 열람할 수 있도록 합니다.
      </p>
      <CodeBlock language="tsx" code={updateSnippet} />
    </Section>

    <Section as="h2" id="callback" title="콜백 갱신">
      <p>
        함수 형태를 전달하면 이전 상태를 기반으로 새로운 값을 계산할 수 있습니다. 이때 반환값은 부분 객체이거나
        <InlineCode>null</InlineCode>이어야 합니다. <InlineCode>null</InlineCode>을 반환하면 변경이 발생하지 않습니다.
      </p>
    </Section>

    <Section as="h2" id="ui" title="UI 컴포넌트와의 협력">
      <p>
        업데이트된 상태는 다음 렌더 사이클에서 컴포넌트에 그대로 전달됩니다. 샘플 Confirm 컴포넌트는
        <InlineCode>step</InlineCode> 값에 따라 버튼을 비활성화하거나 로딩 스피너를 표시합니다. 자세한 구현은
        <InlineCode>components/dialogs/Confirm.tsx</InlineCode>에서 확인할 수 있습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        매니저는 타입 정보를 알지 못하므로, 필요하다면 <InlineCode>updateDialog</InlineCode> 호출 전에
        값 검증/정규화를 수행하세요.
      </p>
    </Section>

    <Section as="h2" id="demo" title="실시간 예제">
      <p>
        비동기 작업과 함께 다이얼로그를 업데이트하는 패턴을 바로 체험해 보세요. 버튼을 눌러 삭제 과정을 시작하면 상태가 순차적으로 갱신됩니다.
      </p>
      <DemoCard title="Async Confirm 데모">
        <AsyncHandlingDemo />
      </DemoCard>
    </Section>
  </DocArticle>
);
