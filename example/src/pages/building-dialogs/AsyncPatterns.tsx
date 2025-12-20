import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const asyncComponentSnippet = `import { useDialogController } from 'react-layered-dialog';
import type { DialogComponent } from 'react-layered-dialog';

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export const ConfirmDialog: DialogComponent<ConfirmDialogProps> = (props) => {
  const controller = useDialogController<ConfirmDialogProps>();
  const { close, unmount, setStatus, getProps, resolve } = controller;
  const { title, message, onConfirm, onCancel } = getProps(props);

  const handleConfirm = async () => {
    // 필요 시 진행 상태 표현
    setStatus('loading');
    await Promise.resolve(onConfirm?.());
    setStatus('done');
    // 비동기 다이얼로그(confirm)의 경우 호출부에 결과를 전달
    resolve?.({ ok: true });
    close();
    unmount();
  };

  const handleCancel = () => {
    onCancel?.();
    resolve?.({ ok: false });
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
};`;

const asyncOpenSnippet = `import { dialog } from '@/lib/dialogs';

// 기본 openAsync 메서드를 사용해 비동기 다이얼로그 열기
const result = await dialog.openAsync(() => (
  <ConfirmDialog title='정말 삭제할까요?' message='이 작업은 되돌릴 수 없습니다.' />
));

if (!result.ok) return; // 사용자가 취소

result.setStatus('loading');
// ...비동기 작업
result.setStatus('done');
result.close();
setTimeout(() => result.unmount(), 200);`;

export const AsyncPatternsPage = () => (
  <DocArticle title="Async & Status Patterns">
    <p className="lead">
      비동기 다이얼로그는 컨트롤러의 <InlineCode>setStatus</InlineCode>, <InlineCode>update</InlineCode>, <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>를 활용해 진행 상황을 제어합니다. UI는 단계별 상태를 표현하고, 호출부에서는 Promise 결과로 흐름을 이어가면 됩니다.
    </p>

    <Section as="h2" id="component" title="Component Implementation">
      <CodeBlock language="tsx" code={asyncComponentSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>setStatus</InlineCode>는 컨트롤러에서 관리하는 전역 상태로, 호출부 Promise가 완료될 때까지 유지됩니다.
        </li>
        <li>
          확인 모달 패턴에서는 <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>로 호출부 흐름을 종료하고,
          상태 표현이 필요하면 <InlineCode>setStatus</InlineCode>와 사용자 정의 상태를 함께 사용하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="caller" title="Caller Patterns">
      <CodeBlock language="ts" code={asyncOpenSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          반환된 결과 객체에는 <InlineCode>ok</InlineCode>, <InlineCode>dialog</InlineCode>, <InlineCode>zIndex</InlineCode>, <InlineCode>status</InlineCode> 등이 포함됩니다. 일반적으로 <InlineCode>ok</InlineCode>로 분기하고, 상태 표현은 컴포넌트 내부에서 담당합니다.
        </li>
        <li>
          비동기 호출이 중첩될 수 있다면 <InlineCode>update</InlineCode>로 UI에 로딩 표시를 추가하고, 완료 후 <InlineCode>close</InlineCode>/<InlineCode>unmount</InlineCode>를 호출하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="api-links" title="API Docs">
      <DocLinks
        links={[
          { to: '/api/use-dialog-controller', label: 'API → useDialogController' },
          { to: '/api/types', label: 'API → 타입 모음' },
          { to: '/api/advanced/async-status', label: 'API(고급) → 비동기 상태' },
        ]}
      />
    </Section>
  </DocArticle>
);
