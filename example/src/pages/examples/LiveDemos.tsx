import { DocArticle } from '@/components/docs/DocArticle';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import { Card, CardContent } from '@/components/ui/card';
import { InlineCode } from '@/components/docs/InlineCode';
import { Section } from '@/components/docs/Section';

export const LiveDemos = () => (
  <DocArticle title="Live Demos">
    <p className="lead">
      <InlineCode>openDialog</InlineCode> 함수를 사용하여 다이얼로그를 여는
      다양한 예제입니다. 각 데모를 통해 기본적인 사용법부터 비동기 처리, 중첩
      호출과 같은 고급 기능까지 직접 테스트해 보세요.
    </p>

    <Section as="h2" id="basic-usage" title="기본 사용법 (Alert, Confirm, Modal)">
      <p>
        가장 일반적으로 사용되는 <InlineCode>Alert</InlineCode>,{' '}
        <InlineCode>Confirm</InlineCode>, <InlineCode>Modal</InlineCode>{' '}
        다이얼로그를 여는 예제입니다.
      </p>
      <Card className="not-prose">
        <CardContent className="pt-6">
          <BasicUsageDemo />
        </CardContent>
      </Card>
    </Section>

    <Section as="h2" id="advanced-features" title="고급 기능 (중첩 및 업데이트)">
      <p>
        다이얼로그 내부에서 또 다른 다이얼로그를 여는 중첩 호출 및 이미
        열려있는 다이얼로그의 내용을 동적으로 업데이트하는 예제입니다.
      </p>
      <Card className="not-prose">
        <CardContent className="pt-6">
          <AdvancedFeaturesDemo />
        </CardContent>
      </Card>
    </Section>

    <Section as="h2" id="async-handling" title="비동기 처리">
      <p>
        <InlineCode>Confirm</InlineCode> 다이얼로그의 결과를 Promise처럼
        활용하여 비동기 작업을 처리하는 예제입니다.
      </p>
      <Card className="not-prose">
        <CardContent className="pt-6">
          <AsyncHandlingDemo />
        </CardContent>
      </Card>
    </Section>
  </DocArticle>
);