import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

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

const rendererWrapperExample = `import { useEffect } from 'react';
import { DialogsRenderer, type DialogStore } from 'react-layered-dialog';
import { useSyncExternalStore } from 'react';

export function AppRenderer({ store }: { store: DialogStore }) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const openEntries = snapshot.entries.filter((e) => e.isOpen);
  const topId = openEntries.length ? openEntries[openEntries.length - 1].id : null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && topId) store.close(topId);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [topId, store]);

  return <DialogsRenderer store={store} />;
}`;

const storeDecoratorExample = `import { type DialogStore } from 'react-layered-dialog';

export function decorateStore(store: DialogStore) {
  const origOpen = store.open;
  store.open = (renderer, options) => {
    console.info('[dialog] open', options);
    const result = origOpen(renderer, options);
    return result;
  };

  const origClose = store.close;
  store.close = (id) => {
    console.info('[dialog] close', id);
    origClose(id);
  };

  return store;
}`;

export const DialogsRendererPage = () => (
  <DocArticle title="DialogsRenderer">
    <p className="lead">
      <InlineCode>DialogsRenderer</InlineCode>는 <InlineCode>DialogStore</InlineCode> 스냅샷을 구독해 등록된
      다이얼로그 컴포넌트를 DOM에 출력합니다. 개념과 활용 포인트에 집중하며, 상세 시그니처는 API 문서를 참조합니다.
    </p>

    <Section as="h2" id="overview" title="Overview">
      <ul className="ml-6 list-disc space-y-2">
        <li><InlineCode>useSyncExternalStore</InlineCode> 패턴으로 스토어의 스냅샷을 구독합니다.</li>
        <li>컨트롤러 컨텍스트를 주입해 컴포넌트 내부에서 <InlineCode>close/unmount/update</InlineCode> 등을 사용할 수 있습니다.</li>
        <li>스택 메타는 <InlineCode>isOpen=true</InlineCode> 항목만 기준으로 최상단/개수를 계산합니다.</li>
        <li>전역 정책(ESC, 포커스, scroll lock)은 보통 별도 훅/래퍼에서 조합합니다.</li>
      </ul>
    </Section>

    <Section as="h2" id="basic-usage" title="Basic Usage">
      <p>
        스토어 인스턴스를 <InlineCode>store</InlineCode> prop으로 전달하면 나머지는 자동으로 처리됩니다.
        별도의 props가 필요 없으므로 어느 위치에서든 쉽게 배치할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={rendererUsage} />
      <p className="mt-2 text-sm text-muted-foreground">
        동일한 스토어를 공유하는 모든 다이얼로그는 이 렌더러를 통해 컨트롤러 컨텍스트를 전달받습니다.
        여러 스토어를 사용한다면 렌더러도 각각 배치해야 합니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        참고: 스택 메타(최상단, 개수, 인덱스)는 <InlineCode>isOpen=true</InlineCode>인 항목만 기준으로 계산됩니다.
        <InlineCode>isOpen=false</InlineCode>지만 DOM에 남아 있는(퇴장 애니메이션 중) 다이얼로그는 보이는 상태가 아니므로
        최상단 판정이나 ESC 처리 등에 참여하지 않습니다.
      </p>
    </Section>

    <Section as="h2" id="custom-renderer" title="Custom Renderer Pattern">
      <p>
        scroll lock, 포커스 트랩, 애니메이션 같은 전역 동작은 대개 개별 다이얼로그의 커스텀 훅에서 구현합니다.
        그래도 필요하다면 렌더러를 래핑해 로깅이나 포털 이동 등 공통 로직을 추가할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={customRenderer} />
      <p className="mt-2 text-sm text-muted-foreground">
        이렇게 감싼 컴포넌트를 재사용하면 프로젝트 전반에서 동일한 전역 정책을 유지할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="Tips">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          렌더러는 React Portal과 조합하기 쉽습니다. 필요한 경우 <InlineCode>createPortal</InlineCode>을 사용해
          전역 레이어 노드로 이동시키세요.
        </li>
        <li>
          테스트 환경에서는 스토어와 렌더러를 함께 마운트해야 컨트롤러 훅이 올바르게 동작합니다.
        </li>
        <li>
          ESC/배경 클릭 같은 전역 동작은 보통 최상단 다이얼로그(<InlineCode>stack.index === stack.size - 1</InlineCode>)에만
          적용하세요. 닫힘 전환(<InlineCode>close()</InlineCode>)과 제거(<InlineCode>unmount()</InlineCode>) 타이밍은 컴포넌트에서
          명시적으로 제어하는 것이 안전합니다.
        </li>
        <li>
          전역 정책을 &quot;렌더러에 넣기 전&quot; 하이재킹하려면, 렌더러를 래핑해 같은 <InlineCode>store</InlineCode>의 스냅샷을
          구독하고 필요한 로직(ESC, dim 클릭 등)을 처리한 뒤 <InlineCode>{`<DialogsRenderer store={store} />`}</InlineCode>만
          반환하는 패턴이 간단합니다.
        </li>
        <li>
          또 다른 방법은 스토어 메서드 데코레이션입니다. 원본 <InlineCode>store.open</InlineCode>/<InlineCode>close</InlineCode>를
          변수에 보관해 두고, 호출 전/후 로깅·정책을 삽입한 뒤 원본을 호출하도록 재할당할 수 있습니다.
          동일 인스턴스를 사용해야 하며, 반환값(핸들/Promise)은 그대로 전달해야 일관성이 유지됩니다.
        </li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">예시 1) 렌더러 래퍼에서 전역 ESC 처리</p>
      <CodeBlock language="tsx" code={rendererWrapperExample} />
      <p className="mt-4 text-sm text-muted-foreground">예시 2) 스토어 메서드 데코레이션으로 프리/포스트 훅 추가</p>
      <CodeBlock language="ts" code={storeDecoratorExample} />
    </Section>

    <Section as="h2" id="next" title="Next Steps">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          다이얼로그 내부 컨트롤러 사용법은 <InlineCode>useDialogController</InlineCode> 문서에서 자세히 다룹니다.
        </li>
      </ul>
    </Section>
    <Section as="h2" id="api-links" title="API Docs">
      <DocLinks links={[{ to: '/api/dialogs-renderer', label: 'API → DialogsRenderer' }]} />
    </Section>
  </DocArticle>
);
