import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const signature = `createDialogManager<T extends { type: string }>(
  config?: { baseZIndex?: number }
): { manager: DialogManager<T> }`;

const example = `const { manager } = createDialogManager<AppDialogState>({
  baseZIndex: 2000,
});

manager.openDialog({ type: 'alert', message: 'Hello' });
manager.closeDialog();`;

export const CreateDialogManager = () => (
  <DocArticle title="createDialogManager">
    <p className="lead">
      스택형 다이얼로그 상태를 관리하는 매니저 인스턴스를 생성합니다. 반환된 객체에는{' '}
      <InlineCode>manager</InlineCode> 한 개만 포함되며, 라이프사이클은 애플리케이션이 직접 제어합니다.
    </p>

    <Section as="h2" id="signature" title="시그니처">
      <CodeBlock language="ts" code={signature} />
    </Section>

    <Section as="h2" id="config" title="설정 옵션">
      <dl className="space-y-4">
        <div>
          <dt className="font-semibold">baseZIndex</dt>
          <dd className="mt-1 text-sm text-muted-foreground">
            자동으로 부여할 z-index의 시작 값입니다. 매니저는 다이얼로그가 열릴 때마다 이 값을 1씩 증가시켜
            할당합니다. 직접 z-index를 명시하면 해당 값이 그대로 사용되며 다음 자동 값도 그보다 큰 값이 되도록
            업데이트됩니다.
          </dd>
        </div>
      </dl>
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="ts" code={example} />
      <p className="mt-2 text-sm text-muted-foreground">
        <InlineCode>manager</InlineCode>는 싱글턴일 필요가 없습니다. 여러 인스턴스를 만들어 독립된 스택을
        수립할 수 있습니다.
      </p>
    </Section>
  </DocArticle>
);
