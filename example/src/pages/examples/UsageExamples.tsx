import { TypographyH2, TypographyP } from '@/components/ui/typography';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UsageExamples = () => (
  <div className="space-y-12">
    <div className="space-y-4">
      <TypographyH2>사용 예제</TypographyH2>
      <TypographyP>
        `openDialog` 함수를 사용하여 `dialogs.ts`에 정의된 다이얼로그를 여는
        다양한 예제입니다. 각 데모를 통해 기본적인 사용법부터 비동기 처리, 중첩
        호출과 같은 고급 기능까지 확인해 보세요.
      </TypographyP>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>기본 사용법 (Alert, Confirm, Modal)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TypographyP>
          가장 일반적으로 사용되는 `Alert`, `Confirm`, `Modal` 다이얼로그를
          여는 예제입니다. `openDialog`의 첫 번째 인자로 다이얼로그의 `type`을,
          두 번째 인자로 `props`를 전달합니다.
        </TypographyP>
        <BasicUsageDemo />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>고급 기능 (중첩 및 업데이트)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TypographyP>
          다이얼로그 내부에서 또 다른 다이얼로그를 여는 중첩 호출(Nesting) 및
          이미 열려있는 다이얼로그의 내용을 동적으로 업데이트하는 예제입니다.
          라이브러리는 `z-index`를 자동으로 관리하여 다이얼로그가 올바른 순서로
          표시되도록 보장합니다.
        </TypographyP>
        <AdvancedFeaturesDemo />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>비동기 처리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TypographyP>
          `onConfirm`과 같은 콜백 함수에 Promise를 전달하여 비동기 작업을 처리하는
          예제입니다. 예를 들어, 확인 버튼 클릭 시 서버 API를 호출하고, 응답
          결과에 따라 다른 다이얼로그(성공 또는 실패 알림)를 표시할 수 있습니다.
        </TypographyP>
        <AsyncHandlingDemo />
      </CardContent>
    </Card>
  </div>
);