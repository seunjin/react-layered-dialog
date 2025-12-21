import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';

const multiStorePattern = `// 독립된 다이얼로그 스택이 필요한 경우 (예: 사이드바, 임베디드 캔버스)
const mainStore = new DialogStore({ baseZIndex: 1000 });
const sidebarStore = new DialogStore({ baseZIndex: 5000 });

// 각 스토어마다 별도의 렌더러 배치
<DialogsRenderer store={mainStore} />
<DialogsRenderer store={sidebarStore} />`;

const usageExample = `// mainStore에서 다이얼로그 열기
mainStore.open(() => <MainAlert />);

// sidebarStore에서 다이얼로그 열기 (mainStore와 독립적)
sidebarStore.open(() => <SidebarModal />);`;

const contextPattern = `// 컨텍스트를 통한 스토어 분리 예시
const MainDialogContext = createContext<DialogStore | null>(null);
const SidebarDialogContext = createContext<DialogStore | null>(null);

function AppShell() {
  const [mainStore] = useState(() => new DialogStore());
  const [sidebarStore] = useState(() => new DialogStore());

  return (
    <MainDialogContext.Provider value={mainStore}>
      <SidebarDialogContext.Provider value={sidebarStore}>
        <MainContent />
        <Sidebar />
        <DialogsRenderer store={mainStore} />
        <DialogsRenderer store={sidebarStore} />
      </SidebarDialogContext.Provider>
    </MainDialogContext.Provider>
  );
}`;

export const ApiAdvancedMultiStorePage = () => (
    <DocArticle title="Multi-store">
        <p className="lead">
            독립적인 다이얼로그 스택이 필요한 경우 여러 스토어를 운영할 수 있습니다.
            각 스토어는 완전히 분리된 z-index 카운터와 엔트리 배열을 가집니다.
        </p>

        <Section as="h2" id="when" title="언제 사용하나요?">
            <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
                <li>메인 콘텐츠와 사이드바에서 독립적인 다이얼로그 스택이 필요한 경우</li>
                <li>임베디드 캔버스/에디터에서 별도의 모달 레이어가 필요한 경우</li>
                <li>마이크로 프론트엔드 구조에서 앱간 격리가 필요한 경우</li>
            </ul>
        </Section>

        <Section as="h2" id="basic" title="기본 패턴">
            <CodeBlock language="tsx" code={multiStorePattern} />
            <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
                <li><InlineCode>baseZIndex</InlineCode> 값이 겹치지 않도록 충분한 간격 필요</li>
                <li>각 스토어별로 <InlineCode>DialogsRenderer</InlineCode> 배치 필수</li>
            </ul>
        </Section>

        <Section as="h2" id="usage" title="사용 예시">
            <CodeBlock language="tsx" code={usageExample} />
        </Section>

        <Section as="h2" id="context" title="컨텍스트 패턴">
            <p className="text-sm text-muted-foreground mb-4">
                React Context를 사용하면 컴포넌트 트리의 특정 영역에서 어떤 스토어를 사용할지 쉽게 결정할 수 있습니다.
            </p>
            <CodeBlock language="tsx" code={contextPattern} />
        </Section>

        <Section as="h2" id="related" title="Related">
            <DocLinks
                links={[
                    { to: '/api/advanced/ssr', label: 'SSR 지원 가이드' },
                    { to: '/fundamentals/architecture', label: '핵심 개념 → 아키텍처 개요' },
                    { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
                ]}
            />
        </Section>
    </DocArticle>
);
