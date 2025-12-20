import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';
import { FunctionSignature } from '@/components/docs/FunctionSignature';

const signature = `function DialogsRenderer({ store }: { store: DialogStore }): JSX.Element`;

const basicExample = `import { DialogStore, DialogsRenderer } from 'react-layered-dialog';

// 1. 스토어 생성 (앱 전역 또는 컴포넌트 레벨)
const store = new DialogStore({ baseZIndex: 1000 });

// 2. 앱 최상단에 렌더러 배치
function App() {
  return (
    <>
      <YourAppContent />
      <DialogsRenderer store={store} />
    </>
  );
}`;

const multiStoreExample = `// 여러 스토어 사용 (레이어 분리)
const alertStore = new DialogStore({ baseZIndex: 1000 });
const modalStore = new DialogStore({ baseZIndex: 2000 });
const toastStore = new DialogStore({ baseZIndex: 3000 });

function App() {
  return (
    <>
      <YourAppContent />
      {/* 각 스토어별로 렌더러 배치 */}
      <DialogsRenderer store={alertStore} />
      <DialogsRenderer store={modalStore} />
      <DialogsRenderer store={toastStore} />
    </>
  );
}`;

const howItWorks = `// 내부 동작 개요 (실제 구현 단순화)
function DialogsRenderer({ store }: { store: DialogStore }) {
  // useSyncExternalStore로 스토어 구독
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
  );

  return (
    <>
      {snapshot.entries.map((entry) => (
        <DialogInstance 
          key={entry.componentKey} 
          store={store} 
          entry={entry} 
        />
      ))}
    </>
  );
}`;

const contextInjection = `// 각 다이얼로그에 컨트롤러 컨텍스트를 주입
// 덕분에 컴포넌트에서 useDialogController() 사용 가능

function DialogInstance({ store, entry, allEntries }) {
  const controller = useMemo(() => ({
    id: entry.id,
    isOpen: entry.isOpen,
    state: entry.state,
    zIndex: entry.zIndex,
    stack: computeStackInfo(allEntries, entry.id),
    close: () => store.close(entry.id),
    unmount: () => store.unmount(entry.id),
    update: (updater) => store.update(entry.id, updater),
    resolve: entry.asyncHandlers?.resolve,
    reject: entry.asyncHandlers?.reject,
    // ... 기타 속성
  }), [entry, allEntries, store]);

  return (
    <DialogControllerProvider value={controller}>
      {entry.renderer(controller)}
    </DialogControllerProvider>
  );
}`;

const animationPattern = `// 애니메이션을 위한 일반적인 패턴
function AnimatedModal() {
  const controller = useDialogController();

  return (
    <AnimatePresence>
      {controller.isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onAnimationComplete={(definition) => {
            // exit 애니메이션 완료 후 unmount
            if (definition === 'exit') {
              controller.unmount();
            }
          }}
          style={{ zIndex: controller.zIndex }}
        >
          <ModalContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}`;

export const ApiDialogsRendererPage = () => (
  <DocArticle title="DialogsRenderer (API Reference)">
    <p className="lead">
      DialogStore의 상태를 구독하고 다이얼로그 엔트리들을 렌더링하는 컨테이너 컴포넌트입니다.
      각 다이얼로그에 컨트롤러 컨텍스트를 주입하여 <InlineCode>useDialogController</InlineCode> 훅 사용을 가능하게 합니다.
    </p>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <FunctionSignature
      id="signature"
      title="<DialogsRenderer />"
      signature={signature}
      description="DialogStore의 상태를 구독하고 다이얼로그 엔트리들을 렌더링하는 컨테이너 컴포넌트입니다."
      parameters={[
        { name: 'store', type: 'DialogStore', description: '다이얼로그 상태를 관리하는 스토어 인스턴스' },
      ]}
      usage={basicExample}
    />

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="basic-usage" title="기본 사용법">
      <CodeBlock language="tsx" code={basicExample} />
      <DocCallout variant="tip" title="배치 위치">
        렌더러를 앱의 최상단(body 직속)에 배치하면 다이얼로그가 다른 UI 위에 표시됩니다.
        Portal을 사용하지 않으므로 렌더러 위치가 곧 다이얼로그 렌더링 위치입니다.
      </DocCallout>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="multi-store" title="멀티 스토어 패턴">
      <CodeBlock language="tsx" code={multiStoreExample} />
      <p className="mt-2 text-sm text-muted-foreground">
        여러 스토어를 사용하여 다이얼로그 레이어를 분리할 수 있습니다.
        각 스토어는 독립적인 z-index 범위와 스택을 관리합니다.
      </p>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="how-it-works" title="동작 원리">
      <Section as="h3" id="subscription" title="스토어 구독">
        <CodeBlock language="tsx" code={howItWorks} />
        <PropertyTable
          items={[
            { name: 'useSyncExternalStore', type: 'React 18', description: '스토어 상태 변경 시 자동 리렌더링' },
            { name: 'entries.map', type: 'iteration', description: '각 엔트리를 개별 컴포넌트로 렌더링' },
            { name: 'componentKey', type: 'key prop', description: '동일 ID라도 재마운트 필요시 key 변경' },
          ]}
        />
      </Section>

      <Section as="h3" id="context-injection" title="컨텍스트 주입">
        <CodeBlock language="tsx" code={contextInjection} />
        <DocCallout variant="info" title="컨트롤러 컨텍스트">
          각 다이얼로그 인스턴스는 자신만의 컨트롤러 컨텍스트를 받습니다.
          컴포넌트에서 <InlineCode>useDialogController()</InlineCode>를 호출하면 이 컨텍스트에 접근합니다.
        </DocCallout>
      </Section>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="animation" title="애니메이션 통합">
      <CodeBlock language="tsx" code={animationPattern} />
      <PropertyTable
        items={[
          { name: 'isOpen', type: 'boolean', description: 'close() 시 false로 전환. 퇴장 애니메이션 조건으로 사용' },
          { name: 'unmount()', type: 'method', description: '애니메이션 완료 후 호출하여 DOM에서 제거' },
          { name: 'zIndex', type: 'number', description: '스타일에 적용하여 레이어 순서 보장' },
        ]}
      />
      <DocCallout variant="warning" title="close vs unmount">
        <InlineCode>close()</InlineCode>만 호출하면 <InlineCode>isOpen=false</InlineCode>가 되어 퇴장 애니메이션이 시작됩니다.
        애니메이션 완료 후 반드시 <InlineCode>unmount()</InlineCode>를 호출해 메모리에서 제거하세요.
      </DocCallout>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="behavior" title="동작 보장 사항">
      <ul className="space-y-4 text-base">
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>렌더링 순서:</strong> <InlineCode>entries</InlineCode> 배열의 순서대로 컴포넌트 트리를 구성하며, 시각적인 레이어 순서는 각 엔트리의 <InlineCode>zIndex</InlineCode> 스타일에 의해 결정됩니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>컨텍스트 격리:</strong> 각 다이얼로그 인스턴스는 매핑된 고유한 컨트롤러 컨텍스트를 보유하여, 서로의 상태나 제어 로직이 섞이지 않도록 보장합니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>스택 정보 계산:</strong> 스택 내에서의 현재 인덱스나 총 스택 크기 정보는 <InlineCode>isOpen=true</InlineCode>인 활성 다이얼로그들을 기준으로 실시간 계산됩니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>메모이제이션:</strong> 레지더링 성능 최적화를 위해 다이얼로그 컨트롤러 객체는 해당 엔트리의 핵심 메타데이터가 변경될 때만 재생성됩니다.
          </span>
        </li>
      </ul>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="ssr" title="SSR 고려사항">
      <DocCallout variant="warning" title="서버 사이드 렌더링">
        다이얼로그는 클라이언트 인터랙션으로만 열리므로 SSR 시점에는 빈 상태입니다.
        서버와 클라이언트의 초기 상태가 동일하게 빈 배열이므로 hydration mismatch가 발생하지 않습니다.
      </DocCallout>
      <p className="mt-2 text-sm text-muted-foreground">
        Next.js 등 SSR 환경에서는 각 요청마다 새 스토어 인스턴스를 생성하거나,
        전역 스토어를 사용하되 서버에서는 빈 상태로 유지하세요.
      </p>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/api/dialog-store', label: 'API → DialogStore' },
          { to: '/api/use-dialog-controller', label: 'API → useDialogController' },
          { to: '/api/types', label: 'API → Types (DialogEntry)' },
          { to: '/api/advanced/multi-store-ssr', label: '고급 → Multi-store/SSR' },
        ]}
      />
    </Section>
  </DocArticle>
);
