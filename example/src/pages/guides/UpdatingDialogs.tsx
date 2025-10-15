import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DemoCard } from '@/components/docs/DemoCard';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';

const updateSnippet = `import { useDialogs } from '@/lib/dialogs';

export const AsyncActionButton = () => {
  const { openDialog, updateDialog } = useDialogs();

  const runTask = async () => {
    const id = openDialog('progress', { status: '요청 중...' });
    try {
      await submitForm();
      updateDialog(id, { status: '완료!', tone: 'success' });
    } catch (error) {
      updateDialog(id, prev => ({
        status: \`\${prev.status}\\n다시 시도해주세요.\`,
        tone: 'error',
      }));
    }
  };

  return <button onClick={runTask}>작업 실행</button>;
};`;

const dialogComponent = `type ProgressState = {
  type: 'progress';
  status: string;
  tone?: 'default' | 'success' | 'error';
};

export const ProgressDialog = ({ status, tone = 'default' }: ProgressState) => (
  <div className={tone === 'error' ? 'bg-red-50' : 'bg-white'}>
    <p>{status}</p>
  </div>
);`;

export const UpdatingDialogs = () => (
  <DocArticle title="다이얼로그 상태 업데이트">
    <p className="lead">
      <InlineCode>updateDialog</InlineCode>는 이미 열린 다이얼로그의 payload를 부분 갱신합니다.
      반환값은 업데이트된 다이얼로그 상태이며, 존재하지 않는 ID를 넘기면 <InlineCode>null</InlineCode>을 반환합니다.
    </p>

    <Section as="h2" id="partial" title="부분 갱신">
      <p>
        객체를 넘기면 해당 필드만 덮어씁니다. 매니저는 병합만 수행하고 값 검증, 기본값 보정 등은 하지 않습니다.
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
        업데이트된 상태는 다음 렌더 사이클에서 컴포넌트에 그대로 전달됩니다. 원하는 구조라면 어떤 UI라도
        사용할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={dialogComponent} />
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
