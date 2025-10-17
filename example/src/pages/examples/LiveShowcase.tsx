import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import { InteractiveConfirmDemo } from '@/components/demos/InteractiveConfirmDemo';
import { LayeredStackDemo } from '@/components/demos/LayeredStackDemo';
import { InlineCode } from '@/components/docs/InlineCode';

export const LiveShowcase = () => (
  <DocArticle title="Live Dialog Showcase">
    <p className="lead">
      다이얼로그를 선언적으로 제어하는 다양한 패턴을 직접 실행해 볼 수 있는
      공간입니다. 토글과 버튼을 조작해 보고, 바로 아래에 표시되는 코드 스니펫을
      참고해 프로젝트에 적용하세요.
    </p>

    <Section as="h2" id="usage" title="Confirm 옵션 실험">
      <p>
        dimmed, closeOnEscape, closeOnOutsideClick, scrollLock 같은{' '}
        <InlineCode>BaseLayerProps</InlineCode>를 토글하면서 어떤 설정이
        적용되는지 즉시 확인하세요. 오른쪽 코드 블록은 현재 옵션에 맞춰 자동으로
        갱신됩니다.
      </p>
      <InteractiveConfirmDemo />
    </Section>

    <Section as="h2" id="stack-control" title="중첩 스택 제어">
      <p>
        제어 패널에서 추가 모달을 열어 보고, <InlineCode>closeDialog</InlineCode>와{' '}
        <InlineCode>closeAllDialogs</InlineCode>로 스택을 어떻게 정리하는지 직접 확인하세요.
        카드 대신 간단한 컨트롤 패널로 구성되어 있어 버튼 흐름만 집중해서 볼 수 있습니다.
      </p>
      <LayeredStackDemo />
    </Section>

    <Section as="h2" id="async" title="비동기 작업과 함께 사용하기">
      <div className="space-y-4 rounded-lg border border-border p-4">
        <div>
          <p className="text-sm text-muted-foreground">
            서버 통신과 같은 비동기 작업을 수행하면서 다이얼로그 상태를 어떻게
            업데이트할 수 있는지 확인해 보세요. 버튼을 누르면 Confirm → 진행 중 →
            완료 단계가 차례로 갱신됩니다.
          </p>
        </div>
        <AsyncHandlingDemo />
      </div>
    </Section>
  </DocArticle>
);

export default LiveShowcase;
