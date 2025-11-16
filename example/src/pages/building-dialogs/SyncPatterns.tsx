import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const syncComponentSnippet = `import { useDialogController } from 'react-layered-dialog';
import type { DialogComponent } from 'react-layered-dialog';

type NoticeProps = {
  title: string;
  message?: string;
  onClose?: () => void;
};

export const NoticeDialog: DialogComponent<NoticeProps> = (props) => {
  const { close, unmount, update, getStateFields, zIndex } = useDialogController<NoticeProps>();
  const { title, message = '완료되었습니다.' } = getStateFields({ title: props.title, message: props.message });

  return (
    <section role="alertdialog" aria-modal="true" style={{ zIndex }}>
      <header className="text-base font-semibold">{title}</header>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded bg-black px-3 py-1 text-white" onClick={() => update({ message: '다시 시도해 주세요.' })}>상태 갱신</button>
        <button className="rounded border px-3 py-1" onClick={() => { close(); unmount(); }}>닫기</button>
      </div>
    </section>
  );
};`;

const externalUpdateSnippet = `import { dialog } from '@/lib/dialogs';

// 열고 나서 외부에서 상태를 갱신/정리
const handle = dialog.store.open(() => (
  <NoticeDialog title="처리 중" message="잠시만 기다려 주세요." />
));

// 완료 시 메시지 변경
handle.update({ message: '완료되었습니다.' });

// 닫기 → 퇴장 → 제거(필요 시 지연)
handle.close();
setTimeout(() => handle.unmount(), 200);`;

export const SyncPatternsPage = () => (
  <DocArticle title="동기 패턴">
    <p className="lead">
      동기 다이얼로그는 <InlineCode>open</InlineCode>으로 열고 즉시 제어 핸들을 반환합니다. 컴포넌트 내부에서
      <InlineCode>update</InlineCode>로 메시지나 라벨을 바꾸거나, 호출부에서 핸들을 통해 외부 업데이트를 수행할 수 있습니다.
    </p>

    <Section as="h2" id="component" title="컴포넌트 내부 업데이트">
      <CodeBlock language="tsx" code={syncComponentSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>getStateFields</InlineCode>로 props와 상태를 읽을 때 병합하면 기본값을 안전하게 유지할 수 있습니다.
        </li>
        <li>
          닫을 때는 <InlineCode>close()</InlineCode> 후 필요하면 퇴장 애니메이션을 거쳐 <InlineCode>unmount()</InlineCode>로 제거하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="caller" title="호출부에서 업데이트">
      <CodeBlock language="tsx" code={externalUpdateSnippet} />
      <p className="mt-2 text-sm text-muted-foreground">
        반환된 핸들의 <InlineCode>update/close/unmount</InlineCode>를 사용하면 컴포넌트 외부에서 흐름을 마무리할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="next" title="다음 단계">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          확인/승인 흐름은 <InlineCode>비동기 &amp; 상태 패턴</InlineCode> 페이지에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);

