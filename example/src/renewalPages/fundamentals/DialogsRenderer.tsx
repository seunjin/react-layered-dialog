import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const rendererUsage = `import { DialogsRenderer } from 'react-layered-dialog';
import { dialog } from '@/lib/dialogs';

export function AppShell() {
  return (
    <>
      <AppLayout />
      <DialogsRenderer store={dialog.store} />
    </>
  );
}`;

const customRenderer = `import { DialogsRenderer, type DialogStore } from 'react-layered-dialog';

type DialogRendererProps = {
  store: DialogStore;
};

export function DialogRenderer({ store }: DialogRendererProps) {
  return <DialogsRenderer store={store} />;
}`;

export const DialogsRendererPage = () => (
  <DocArticle title="DialogsRenderer">
    <p className="lead">
      <InlineCode>DialogsRenderer</InlineCode>는 <InlineCode>DialogStore</InlineCode> 스냅샷을 구독해 등록된
      다이얼로그 컴포넌트를 DOM에 출력합니다. 렌더러를 앱 엔트리에 배치하면 컨트롤러가 컨텍스트를 통해
      스토어와 연결됩니다.
    </p>

    <Section as="h2" id="basic-usage" title="기본 사용">
      <p>
        스토어 인스턴스를 <InlineCode>store</InlineCode> prop으로 전달하면 나머지는 자동으로 처리됩니다.
        별도의 props가 필요 없으므로 어느 위치에서든 쉽게 배치할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={rendererUsage} />
      <p className="mt-2 text-sm text-muted-foreground">
        동일한 스토어를 공유하는 모든 다이얼로그는 이 렌더러를 통해 컨트롤러 컨텍스트를 전달받습니다.
        여러 스토어를 사용한다면 렌더러도 각각 배치해야 합니다.
      </p>
    </Section>

    <Section as="h2" id="custom-renderer" title="커스텀 렌더러 패턴">
      <p>
        scroll lock, 포커스 트랩, 애니메이션 같은 전역 동작은 대개 개별 다이얼로그의 커스텀 훅에서 구현합니다.
        그래도 필요하다면 렌더러를 래핑해 로깅이나 포털 이동 등 공통 로직을 추가할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={customRenderer} />
      <p className="mt-2 text-sm text-muted-foreground">
        이렇게 감싼 컴포넌트를 재사용하면 프로젝트 전반에서 동일한 전역 정책을 유지할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          렌더러는 React Portal과 조합하기 쉽습니다. 필요한 경우 <InlineCode>createPortal</InlineCode>을 사용해
          전역 레이어 노드로 이동시키세요.
        </li>
        <li>
          테스트 환경에서는 스토어와 렌더러를 함께 마운트해야 컨트롤러 훅이 올바르게 동작합니다.
        </li>
        <li>
          전역 scroll lock을 사용할 때는 <InlineCode>.scroll-locked</InlineCode> 같은 클래스를 전역 스타일에 미리 정의해 두세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="다음 읽을 거리">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          다이얼로그 내부 컨트롤러 사용법은 <InlineCode>useDialogController</InlineCode> 문서에서 자세히 다룹니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
