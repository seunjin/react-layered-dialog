import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Section } from '@/components/docs/Section';

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
  <DocArticle title="createDialogManager">
    <p className="lead">
      다이얼로그 상태를 관리하는 핵심 엔진인{' '}
      <InlineCode>DialogManager</InlineCode> 인스턴스를 생성합니다.
    </p>
    <p>
      이 함수는 라이브러리 설정의 가장 첫 단계에서 호출되어야 합니다. 여기서
      생성된 <InlineCode>manager</InlineCode>는 앱의 모든 다이얼로그 상태를
      저장하고 관리하는 중앙 저장소 역할을 합니다.
    </p>

    <Section as="h2" id="signature" title="Function Signature">
      <CodeBlock language="typescript" code={functionSignature} />
    </Section>

    <Section as="h2" id="parameters" title="Parameters">
      <Card className="not-prose">
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
    </Section>

    <Section as="h2" id="return-value" title="Return Value">
      <p>
        <InlineCode>manager</InlineCode> 속성을 포함하는 객체를 반환합니다. 이{' '}
        <InlineCode>manager</InlineCode> 인스턴스는 이후{' '}
        <InlineCode>createUseDialogs</InlineCode> 함수에 인자로 전달되어야
        합니다.
      </p>
    </Section>

    <Section as="h2" id="usage" title="Usage Example">
      <CodeBlock language="typescript" code={usageExample} />
    </Section>
  </DocArticle>
);