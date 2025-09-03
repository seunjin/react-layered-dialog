import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from '@/components/docs/typography';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const functionSignature = `function createDialogManager<T>(config?: DialogsConfig): { manager: DialogManager<T> };`;

const usageExample = `// src/lib/dialogs.ts

import { createDialogManager } from 'react-layered-dialog';
import type { CustomDialogState } from './types'; // 사용자가 정의한 유니온 타입

// 1. 다이얼로그 매니저 생성
const { manager } = createDialogManager<CustomDialogState>({
  baseZIndex: 2000, // (선택 사항) z-index 시작 값 변경
});

// ... 이어서 createUseDialogs에 manager를 전달
`;

const dialogsConfigCode = `export interface DialogsConfig {
  /**
   * 다이얼로그의 z-index가 시작될 기본 값입니다.
   * @default 1000
   */
  baseZIndex?: number;
}`;

export const CreateDialogManager = () => (
  <div className="space-y-12">
    <div>
      <TypographyH2>createDialogManager</TypographyH2>
      <TypographyLead>
        다이얼로그 상태를 관리하는 핵심 엔진인{' '}
        <InlineCode>DialogManager</InlineCode> 인스턴스를 생성합니다.
      </TypographyLead>
      <TypographyP className="mt-4">
        이 함수는 라이브러리 설정의 가장 첫 단계에서 호출되어야 합니다. 여기서
        생성된 <InlineCode>manager</InlineCode>는 앱의 모든 다이얼로그 상태를
        저장하고 관리하는 중앙 저장소 역할을 합니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>Function Signature</TypographyH3>
      <CodeBlock language="typescript" code={functionSignature} />
    </div>

    <div className="space-y-4">
      <TypographyH3>Parameters</TypographyH3>
      <Card>
        <CardHeader>
          <CardTitle>config (optional)</CardTitle>
          <CardDescription>
            <InlineCode>DialogsConfig</InlineCode> 타입의 객체로, 라이브러리의
            전역 동작을 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock language="typescript" code={dialogsConfigCode} />
        </CardContent>
      </Card>
    </div>

    <div className="space-y-4">
      <TypographyH3>Return Value</TypographyH3>
      <TypographyP>
        <InlineCode>manager</InlineCode> 속성을 포함하는 객체를 반환합니다. 이{' '}
        <InlineCode>manager</InlineCode> 인스턴스는 이후{' '}
        <InlineCode>createUseDialogs</InlineCode> 함수에 인자로 전달되어야
        합니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>Usage Example</TypographyH3>
      <CodeBlock language="typescript" code={usageExample} />
    </div>
  </div>
);
