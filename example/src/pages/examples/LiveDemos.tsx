import { DocArticle } from '@/components/docs/DocArticle';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InlineCode } from '@/components/docs/InlineCode';

export const LiveDemos = () => (
  <DocArticle>
    <h1>Live Demos</h1>
    <p>
      <InlineCode>openDialog</InlineCode> 함수를 사용하여 다이얼로그를 여는 다양한
      예제입니다. 각 데모를 통해 기본적인 사용법부터 비동기 처리, 중첩 호출과
      같은 고급 기능까지 직접 테스트해 보세요.
    </p>

    <Card>
      <CardHeader>
        <CardTitle>기본 사용법 (Alert, Confirm, Modal)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p>
          가장 일반적으로 사용되는 <InlineCode>Alert</InlineCode>,{' '}
          <InlineCode>Confirm</InlineCode>, <InlineCode>Modal</InlineCode>{' '}
          다이얼로그를 여는 예제입니다.
        </p>
        <BasicUsageDemo />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>고급 기능 (중첩 및 업데이트)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p>
          다이얼로그 내부에서 또 다른 다이얼로그를 여는 중첩 호출 및
          이미 열려있는 다이얼로그의 내용을 동적으로 업데이트하는 예제입니다.
        </p>
        <AdvancedFeaturesDemo />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>비동기 처리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p>
          <InlineCode>Confirm</InlineCode> 다이얼로그의 결과를 Promise처럼
          활용하여 비동기 작업을 처리하는 예제입니다.
        </p>
        <AsyncHandlingDemo />
      </CardContent>
    </Card>
  </DocArticle>
);
