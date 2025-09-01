import { TypographyH2, TypographyP } from '@/components/ui/typography';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';

export const BasicDialogs = () => (
  <div className="space-y-12">
    <div>
      <TypographyH2>기본 사용법</TypographyH2>
      <TypographyP className="mt-2">
        가장 기본적인 Alert와 Confirm 다이얼로그를 여는 예제입니다.
      </TypographyP>
      <BasicUsageDemo />
    </div>

    <div>
      <TypographyH2>고급 기능</TypographyH2>
      <TypographyP className="mt-2">
        다이얼로그를 중첩해서 열거나, 이미 열린 다이얼로그의 내용을 동적으로
        업데이트하는 예제입니다.
      </TypographyP>
      <AdvancedFeaturesDemo />
    </div>

    <div>
      <TypographyH2>비동기 처리</TypographyH2>
      <TypographyP className="mt-2">
        확인 버튼을 눌렀을 때 Promise를 사용하여 비동기 작업을 처리하고, 작업
        결과에 따라 다이얼로그를 제어하는 예제입니다.
      </TypographyP>
      <AsyncHandlingDemo />
    </div>
  </div>
);

