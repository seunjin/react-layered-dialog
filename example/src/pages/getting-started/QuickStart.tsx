import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/docs/typography';

// `?raw`를 사용하여 코드 파일의 원본 텍스트를 가져옵니다.
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';
import alertComponentCode from '@/code-templates/AlertBasic.tsx.txt?raw';
import dialogRendererCode from '@/code-templates/DialogRenderer.tsx.txt?raw';
import appTsxCode from '@/code-templates/App.tsx.txt?raw';
import usageCode from '@/code-templates/usage.tsx.txt?raw';

export const QuickStart = () => (
  <div className="space-y-12">
    <div>
      <TypographyH2>Quick Start</TypographyH2>
      <TypographyP className="mt-2">
        라이브러리 설치 후, 4단계에 따라 핵심 파일을 설정하여 첫 번째 다이얼로그를 실행해보세요.
      </TypographyP>
    </div>

    <div className="space-y-4">
      <TypographyH3>1단계: 다이얼로그 시스템 정의</TypographyH3>
      <TypographyP>
        <InlineCode>src/lib/dialogs.ts</InlineCode> 파일을 생성하여 앱에서 사용할 다이얼로그의 종류와 동작을 정의합니다.
      </TypographyP>
      <CodeBlock language="typescript" code={dialogsTsCode} />
    </div>

    <div className="space-y-4">
      <TypographyH3>2단계: 다이얼로그 컴포넌트 생성</TypographyH3>
      <TypographyP>
        <InlineCode>dialogs.ts</InlineCode>에 정의한 <InlineCode>alert</InlineCode> 타입을 위한 <InlineCode>Alert.tsx</InlineCode> 컴포넌트를 생성합니다.
      </TypographyP>
      <CodeBlock language="tsx" code={alertComponentCode} />
    </div>

    <div className="space-y-4">
      <TypographyH3>3단계: 렌더링 레이어 설정</TypographyH3>
      <TypographyP>
        <InlineCode>DialogRenderer</InlineCode> 컴포넌트는 다이얼로그 상태를 실제 UI로 렌더링하는 역할을 합니다. 이 컴포넌트를 생성하고 앱의 최상위 레벨에 추가하세요.
      </TypographyP>
      <CodeBlock language="tsx" code={dialogRendererCode} />
      <CodeBlock language="tsx" code={appTsxCode} />
    </div>
    
    <div className="space-y-4">
      <TypographyH3>4단계: 다이얼로그 열기</TypographyH3>
      <TypographyP>
        이제 어떤 컴포넌트에서든 <InlineCode>openDialog</InlineCode> 함수를 호출하여 다이얼로그를 열 수 있습니다.
      </TypographyP>
      <CodeBlock language="tsx" code={usageCode} />
    </div>
  </div>
);
