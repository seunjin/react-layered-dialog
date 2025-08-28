import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
} from '@/components/ui/typography';

export const Examples = () => (
  <div className="space-y-8">
    <TypographyH1>사용 예제</TypographyH1>
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>개발자 콘솔을 확인하세요!</AlertTitle>
      <AlertDescription>
        F12를 눌러 개발자 콘솔을 열면, 모든 다이얼로그 상태 변화가 실시간으로 기록되는 것을 확인할 수 있습니다.
      </AlertDescription>
    </Alert>

    <section className="space-y-4">
      <TypographyH2>기본 사용법</TypographyH2>
      <TypographyP>가장 일반적인 다이얼로그 타입들을 여는 예제입니다.</TypographyP>
      <div className="rounded-md border p-6">
        <BasicUsageDemo />
      </div>
    </section>

    <section className="space-y-4">
      <TypographyH2>고급 기능</TypographyH2>
      <TypographyP>다이얼로그 안에서 다른 다이얼로그를 제어하는 예제입니다.</TypographyP>
      <div className="rounded-md border p-6">
        <AdvancedFeaturesDemo />
      </div>
    </section>

    <section className="space-y-4">
      <TypographyH2>비동기 처리</TypographyH2>
      <TypographyP>API 요청과 같은 비동기 작업과 다이얼로그를 연동하는 예제입니다.</TypographyP>
      <div className="rounded-md border p-6">
        <AsyncHandlingDemo />
      </div>
    </section>
  </div>
);