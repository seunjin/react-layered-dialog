import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/ui/typography';
import animatedAlertCode from '@/components/templates/AlertAnimated.tsx?raw';
import basicAlertCode from '@/components/templates/AlertBasic.tsx?raw';
import animatedConfirmCode from '@/components/templates/ConfirmAnimated.tsx?raw';
import basicConfirmCode from '@/components/templates/ConfirmBasic.tsx?raw';

export const QuickStart = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>빠른 시작: 기본 컴포넌트 만들기</TypographyH2>
      <TypographyP className="mt-2">
        라이브러리 설정을 마쳤다면, 가장 먼저 필요한 `Alert`와 `Confirm`
        다이얼로그를 만들어 보세요. 아래 코드를 복사하여 프로젝트의{' '}
        <InlineCode>components/dialogs</InlineCode> 폴더에 추가하고,
        <InlineCode>lib/dialogs.ts</InlineCode>에 등록하면 바로 사용할 수
        있습니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>Alert 컴포넌트</TypographyH3>
      <Tabs defaultValue="basic" className="mt-4">
        <TabsList>
          <TabsTrigger value="basic">기본 버전</TabsTrigger>
          <TabsTrigger value="animated">애니메이션 버전</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-2">
          <CodeBlock language="tsx" code={basicAlertCode} />
        </TabsContent>
        <TabsContent value="animated" className="mt-2">
          <TypographyP className="text-sm text-muted-foreground mb-2">
            애니메이션을 사용하려면 <InlineCode>motion</InlineCode> 라이브러리가
            필요합니다: <InlineCode>pnpm add motion</InlineCode>
          </TypographyP>
          <CodeBlock language="tsx" code={animatedAlertCode} />
        </TabsContent>
      </Tabs>
    </div>

    <div>
      <TypographyH3>Confirm 컴포넌트</TypographyH3>
      <Tabs defaultValue="basic" className="mt-4">
        <TabsList>
          <TabsTrigger value="basic">기본 버전</TabsTrigger>
          <TabsTrigger value="animated">애니메이션 버전</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-2">
          <CodeBlock language="tsx" code={basicConfirmCode} />
        </TabsContent>
        <TabsContent value="animated" className="mt-2">
          <TypographyP className="text-sm text-muted-foreground mb-2">
            애니메이션을 사용하려면 <InlineCode>motion</InlineCode> 라이브러리가
            필요합니다: <InlineCode>pnpm add motion</InlineCode>
          </TypographyP>
          <CodeBlock language="tsx" code={animatedConfirmCode} />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);
