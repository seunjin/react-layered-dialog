import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const openFromComponent = `import { useDialogs } from '@/lib/dialogs';

export const Toolbar = () => {
  const { openDialog } = useDialogs();

  return (
    <button
      onClick={() =>
        openDialog('alert', {
          title: '안내',
          message: '이 알림은 컴포넌트 내부에서 열렸습니다.',
        })
      }
    >
      알림 열기
    </button>
  );
};`;

const openFromImperative = `import { openDialog } from '@/lib/dialogs';

export async function fetchProfile() {
  try {
    const result = await fetch('/me');
    if (!result.ok) throw new Error('failed');
    return await result.json();
  } catch (error) {
    openDialog({
      type: 'alert',
      title: '네트워크 오류',
      message: '프로필 정보를 불러오지 못했습니다.',
    });
    throw error;
  }
}`;

export const OpeningDialogs = () => (
  <DocArticle title="다이얼로그 열기 & 닫기">
    <p className="lead">
      훅을 통해 선언적으로 다이얼로그를 열거나, 매니저 메서드를 직접 호출해 어디서든 관리할 수 있습니다.
      코어는 단지 상태를 추가/제거할 뿐이며, 어떤 UI가 나올지는 개발자가 완전히 통제합니다.
    </p>

    <Section as="h2" id="hook" title="컴포넌트 내부에서 열기">
      <p>
        <InlineCode>useDialogs</InlineCode>는 가장 일반적인 접근 방식입니다.
        훅에서 받은 <InlineCode>openDialog</InlineCode> 함수는 타입 안전하게 payload를 검증합니다.
      </p>
      <CodeBlock language="tsx" code={openFromComponent} />
    </Section>

    <Section as="h2" id="manager" title="컴포넌트 외부에서 열기">
      <p>
        API 호출, 상태 머신, 이벤트 핸들러 등 React 컨텍스트 밖에서도 다이얼로그를 관리하고 싶다면
        매니저 메서드를 그대로 export하여 사용하면 됩니다. 클래스가 아닌 클로저 기반 스토어라
        <InlineCode>this</InlineCode> 손실 걱정이 없습니다.
      </p>
      <CodeBlock language="ts" code={openFromImperative} />
    </Section>

    <Section as="h2" id="closing" title="닫기 & 정리">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>closeDialog()</InlineCode>: 인자 없이 호출하면 가장 최근에 열린 다이얼로그를 닫습니다.
        </li>
        <li>
          <InlineCode>closeDialog(id)</InlineCode>: 특정 ID를 넘기면 원하는 다이얼로그만 제거할 수 있습니다.
        </li>
        <li>
          <InlineCode>closeAllDialogs()</InlineCode>: 스택을 즉시 비웁니다. 라우트 이동 시 유용합니다.
        </li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        ID는 <InlineCode>openDialog</InlineCode>가 반환합니다. 자체 ID를 부여하려면 payload에{' '}
        <InlineCode>id</InlineCode> 필드를 명시하세요.
      </p>
    </Section>
  </DocArticle>
);
