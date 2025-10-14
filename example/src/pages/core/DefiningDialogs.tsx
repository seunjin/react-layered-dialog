import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const stateSnippet = `// dialog-types.ts
import type { DialogState } from 'react-layered-dialog';

export type DialogPayload =
  | {
      type: 'alert';
      title: string;
      message: string;
    }
  | {
      type: 'confirm';
      title: string;
      onConfirm: () => void;
      onCancel?: () => void;
    };

export type AlertDialogState = DialogState<Extract<DialogPayload, { type: 'alert' }>>;
export type ConfirmDialogState = DialogState<Extract<DialogPayload, { type: 'confirm' }>>;`;

const mapSnippet = `// dialog-map.tsx
import type { DialogInstance } from 'react-layered-dialog';
import type { DialogPayload } from './dialog-types';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

export const dialogComponentMap: Record<
  DialogPayload['type'],
  DialogInstance<DialogPayload>['Component']
> = {
  alert: Alert,
  confirm: Confirm,
};`;

export const DefiningDialogs = () => (
  <DocArticle title="다이얼로그 타입 설계">
    <p className="lead">
      모든 다이얼로그는 <InlineCode>type</InlineCode> 필드를 가진 디스크리미네이티드 유니온으로
      정의합니다. 나머지 필드는 각 다이얼로그의 UI에 필요한 최소 props만 포함하세요.
    </p>

    <Section as="h2" id="union" title="상태 유니온 작성">
      <p>
        라이브러리는 상태를 변경하거나 기본값을 삽입하지 않습니다. 따라서{' '}
        <InlineCode>type</InlineCode> 외에는 필요한 값만 선언하면 됩니다.{' '}
        <InlineCode>id</InlineCode>, <InlineCode>isOpen</InlineCode>,{' '}
        <InlineCode>zIndex</InlineCode> 등 메타 필드는 매니저가 자동으로 부여합니다.
      </p>
      <CodeBlock language="ts" code={stateSnippet} />
    </Section>

    <Section as="h2" id="component-map" title="컴포넌트 매핑">
      <p>
        <InlineCode>createUseDialogs</InlineCode>에 전달하는 컴포넌트 맵은 단순한 객체입니다.
        다이얼로그 상태를 받아 JSX를 반환하는 함수이면 무엇이든 사용할 수 있습니다.
        <InlineCode>DialogInstance</InlineCode> 타입을 사용하면 각 컴포넌트에 정확한 props 타입이
        연결됩니다.
      </p>
      <CodeBlock language="tsx" code={mapSnippet} />
    </Section>

    <Section as="h2" id="tips" title="설계 팁">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>세부 동작은 컴포넌트에게 맡기세요</b>. dim, 포커스, 애니메이션 등은 UI 컴포넌트가
          직접 관리하도록 하면 테스트가 쉬워집니다.
        </li>
        <li>
          <b>추상화는 최소한</b>으로 유지합니다. 다이얼로그가 복잡해지면 별도 상태 머신이나
          훅을 도입하고 매니저에는 순수 데이터를 전달하세요.
        </li>
        <li>
          <b>확장 가능한 키 전략</b>: type 이름을 폴더 구조나 도메인 이름과 맞춰 두면
          프로젝트 규모가 커져도 추적이 편합니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
