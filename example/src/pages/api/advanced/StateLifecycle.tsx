import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';
import { DocLinks } from '@/components/docs/DocLink';

const sequence = `// 권장 시퀀스
// 1) close() → isOpen=false로 전환 (DOM 유지, 퇴장 애니메이션 트리거)
// 2) 애니메이션 종료 타이밍에 unmount() 호출 (스택 제거)

const controller = useDialogController();
const onDismiss = () => {
  controller.close();
  setTimeout(() => controller.unmount(), 200); // 예시 값
};`;

const closeAllPattern = `// 모든 다이얼로그 퇴장 → 각자 종료 후 정리
controller.closeAll();
// 필요 시 상위 컨텍스트/타이머/애니메이션 훅에서 개별 unmount() 수행`;

export const ApiAdvancedStateLifecyclePage = () => (
  <DocArticle title="State/Lifecycle">
    <p className="lead">닫힘 전환과 제거 타이밍을 분리해 애니메이션과 접근성을 안정적으로 제어합니다.</p>

    <Section as="h2" id="definition" title="Definition/Signature">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li><InlineCode>close()</InlineCode>: <InlineCode>isOpen=false</InlineCode> 전환 (DOM 유지).</li>
        <li><InlineCode>unmount()</InlineCode>: 스택에서 즉시 제거 (DOM 제거).</li>
        <li><InlineCode>closeAll()</InlineCode>/<InlineCode>unmountAll()</InlineCode>: 전체 스택 대상.</li>
      </ul>
    </Section>

    <Section as="h2" id="guarantees" title="Behavior Guarantees">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>닫힘 전환만으로 DOM은 유지됩니다. 퇴장 애니메이션을 안전하게 수행할 수 있습니다.</li>
        <li>제거 시점은 프로젝트 정책에 맞춰 명시적으로 결정하세요.</li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="Examples">
      <CodeBlock language="ts" code={sequence} />
      <p className="mt-2 text-sm text-muted-foreground">여러 개를 한 번에 닫는 패턴:</p>
      <CodeBlock language="ts" code={closeAllPattern} />
    </Section>

    <Section as="h2" id="notes" title="Notes">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>컨트롤러 훅은 <Link to="/api/use-dialog-controller">API → useDialogController</Link> 참조.</li>
        <li>렌더러 구독 규칙은 <Link to="/api/dialogs-renderer">API → DialogsRenderer</Link> 참조.</li>
      </ul>
    </Section>
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/fundamentals/use-dialog-controller', label: '핵심 개념 → useDialogController' },
          { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
          { to: '/building-dialogs/components', label: '구현 가이드 → 컴포넌트 기본기' },
        ]}
      />
    </Section>
  </DocArticle>
);
