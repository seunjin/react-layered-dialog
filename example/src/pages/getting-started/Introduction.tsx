import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InlineCode } from '@/components/ui/InlineCode';
import {
  TypographyH1,
  TypographyP,
  TypographyLead,
} from '@/components/ui/typography';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const Introduction = () => (
  <div className="space-y-8">
    <div>
      <TypographyH1>React Layered Dialog</TypographyH1>
      <TypographyLead>
        React 다이얼로그 관리를 위한 선언적이고 타입-안전한 솔루션
      </TypographyLead>

      <div className="my-6 rounded-lg border bg-muted/30 p-4 text-center">
        <p className="text-lg font-semibold">
          [라이브러리 동작 GIF/스크린샷 영역]
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          여러 다이얼로그가 중첩되고 순서에 맞게 관리되는 모습을 보여주는 이미지
        </p>
      </div>

      <TypographyP>
        React 애플리케이션에서 다이얼로그를 관리하는 것은 흔히 복잡한 상태
        관리와 z-index 충돌을 야기합니다.{' '}
        <InlineCode>React Layered Dialog</InlineCode>는 이러한 문제를 해결하고자
        탄생했으며, 중앙 집중식 API를 통해 다이얼로그 관리를 단순화합니다.
      </TypographyP>
    </div>

    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>3분만에 시작하기</CardTitle>
          <CardDescription>
            라이브러리를 설치하고 핵심 파일을 설정하여 바로 사용해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            language="bash"
            code={`# 1. 라이브러리 설치
pnpm add react-layered-dialog

# 2. (선택) 애니메이션을 위한 framer-motion 설치
pnpm add framer-motion`}
          />
          <div className="mt-4">
            <TypographyP>
              자세한 설정 방법은{' '}
              <a href="/getting-started/quick-start" className="font-medium text-primary underline">
                Quick Start
              </a>{' '}
              페이지를 참고하세요.
            </TypographyP>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>가벼움과 유연성</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            React에만 의존하는 가벼운 코어. 어떤 UI 컴포넌트 라이브러리와도 쉽게
            통합하여 사용할 수 있습니다.
          </TypographyP>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>타입 안전성</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            TypeScript 기반으로 설계되어, 다이얼로그를 열 때 필요한 `props`를
            자동으로 추론하고 잘못된 사용을 방지합니다.
          </TypographyP>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>접근성</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            자동 포커스 관리 및 키보드 상호작용(ESC)을 지원하여 웹 접근성을
            준수합니다. (상세 기능은 추가될 예정입니다)
          </TypographyP>
        </CardContent>
      </Card>
    </div>
  </div>
);
