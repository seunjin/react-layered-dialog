import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const asyncComponentSnippet = `import { useDialogController } from 'react-layered-dialog';
import type { ConfirmDialogProps } from '@/lib/dialogs';

export function ConfirmDialog(props: ConfirmDialogProps) {
  const controller = useDialogController<ConfirmDialogProps>();
  const { close, unmount, setStatus, getStateFields } = controller;
  const { title, message, onConfirm, onCancel } = getStateFields(props);

  const handleConfirm = async () => {
    setStatus('loading');
    await Promise.resolve(onConfirm?.());
    setStatus('done');
    close();
    unmount();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
    unmount();
  };

  return (
    <div role="alertdialog" aria-modal="true">
      <h3>{title}</h3>
      <p>{message}</p>
      <footer>
        <button onClick={handleCancel}>취소</button>
        <button onClick={handleConfirm}>확인</button>
      </footer>
    </div>
  );
}`;

const asyncOpenSnippet = `const result = await dialog.confirm({
  title: '정말 삭제할까요?',
  message: '이 작업은 되돌릴 수 없습니다.',
});

if (result.status === 'done') {
  // 후속 로직 처리
}`;

export const AsyncPatternsPage = () => (
  <DocArticle title="비동기 & 상태 패턴">
    <p className="lead">
      비동기 다이얼로그는 컨트롤러의 <InlineCode>setStatus</InlineCode>, <InlineCode>update</InlineCode>, <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>를 활용해 진행 상황을 제어합니다. UI는 단계별 상태를 표현하고, 호출부에서는 Promise 결과로 흐름을 이어가면 됩니다.
    </p>

    <Section as="h2" id="component" title="컴포넌트 구현">
      <CodeBlock language="tsx" code={asyncComponentSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>setStatus</InlineCode>는 컨트롤러에서 관리하는 전역 상태로, 호출부 Promise가 완료될 때까지 유지됩니다.
        </li>
        <li>
          에러를 처리하려면 <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>를 직접 호출하거나, 상태에 <InlineCode>error</InlineCode> 필드를 추가해 UI에 반영하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="caller" title="호출부 패턴">
      <CodeBlock language="ts" code={asyncOpenSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          반환된 결과 객체에는 <InlineCode>dialog</InlineCode>, <InlineCode>zIndex</InlineCode>, <InlineCode>status</InlineCode> 등이 포함됩니다. 필요한 경우 호출부에서 상태를 확인해 후속 로직을 분기할 수 있습니다.
        </li>
        <li>
          비동기 호출이 중첩될 수 있다면 <InlineCode>update</InlineCode>로 UI에 로딩 표시를 추가하고, 완료 후 <InlineCode>close</InlineCode>/<InlineCode>unmount</InlineCode>를 호출하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          동작 플래그 설계는 <InlineCode>동작 패턴</InlineCode> 페이지에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
