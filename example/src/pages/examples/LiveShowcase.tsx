import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { DemoCard } from '@/components/docs/DemoCard';
import { UsageToggleContainer } from '@/components/demos/UsageToggleContainer';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import usageCode from '@/code-templates/usage.tsx.txt?raw';

export const LiveShowcase = () => (
  <DocArticle title="Live Dialog Showcase">
    <p className="lead">
      실제로 동작하는 다이얼로그 예제를 모아둔 페이지입니다. 각 카드에서 버튼을 눌러보고, 필요하면 코드를 즉시 복사하여 프로젝트에 적용하세요.
    </p>

    <Section as="h2" id="usage" title="Alert / Confirm / Modal 비교">
      <p>
        스위치를 사용해 애니메이션 유무를 바로 비교해 보세요. 기본값은 애니메이션이 없는 버전이며, 토글을 켜면 Framer Motion 기반 구현으로 바뀝니다.
      </p>
      <UsageToggleContainer
        title="기본 다이얼로그 토글"
        description="스위치를 토글하며 Plain/Motion 구현을 비교해 보세요. 코드 탭도 함께 변경됩니다."
      />
    </Section>

    <Section as="h2" id="animated" title="Framer Motion 고급 패턴">
      <p>
        라이브러리와 함께 제공되는 기본 다이얼로그 컴포넌트는 <code>motion/react</code>를 사용해 자연스러운 전환을 제공합니다. 아래 예제에서는 중첩과 제어 패널을 확인할 수 있습니다.
      </p>
      <DemoCard
        title="중첩 및 제어 패널"
        description="여러 개의 모달을 중첩해서 열고 닫는 플레이를 경험해 보세요."
        code={usageCode}
      >
        <AdvancedFeaturesDemo />
      </DemoCard>
    </Section>

    <Section as="h2" id="async" title="비동기 작업과 함께 사용하기">
      <p>
        서버 통신과 같은 비동기 작업과 다이얼로그를 결합하면 진행 상태를 명확히 전달할 수 있습니다.
      </p>
      <DemoCard
        title="Async Confirm"
        description="삭제 확인 → 진행중 표시 → 완료 알림까지 이어지는 흐름을 구현한 예제입니다."
      >
        <AsyncHandlingDemo />
      </DemoCard>
    </Section>
  </DocArticle>
);

export default LiveShowcase;
