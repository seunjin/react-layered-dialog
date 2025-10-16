import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const basePatternSnippet = `// dialog-types.ts
import type { BaseState, DialogState } from 'react-layered-dialog';

type AlertPayload = BaseState & {
  type: 'alert';
  title: string;
  message: string;
};

type ConfirmPayload = BaseState & {
  type: 'confirm';
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type AppDialogState = AlertPayload | ConfirmPayload;
export type AlertDialogProps = DialogState<AlertPayload>;
export type ConfirmDialogProps = DialogState<ConfirmPayload>;`;

const layeredPatternSnippet = `// dialog-types.ts (커스텀 메타 필드를 직접 정의)
import type { DialogState, DialogInstance } from 'react-layered-dialog';

type AlertState = {
  type: 'alert';
  title: string;
  message: string;
  outsideClickEnabled?: boolean;
};

type ConfirmState = {
  type: 'confirm';
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
  dismissable?: boolean;
};

type AppDialogState = DialogState<AlertState> | DialogState<ConfirmState>;
export type AppDialogInstance = DialogInstance<AppDialogState>;`;

const directPayloadSnippet = `// dialog-types.ts (필요한 필드만 선언하는 가장 단순한 형태)
type RawAlert = {
  type: 'alert';
  title: string;
  message: string;
};

type RawConfirm = {
  type: 'confirm';
  title: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type AppDialogPayload = RawAlert | RawConfirm;`;

const mapSnippet = `// dialog-map.tsx
import type { DialogInstance } from 'react-layered-dialog';
import type { AppDialogState } from './dialog-types';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

export const dialogComponentMap: Record<
  AppDialogState['type'],
  DialogInstance<AppDialogState>['Component']
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

    <Section as="h2" id="patterns" title="대표 설계 패턴">
      <Section as="h3" id="pattern-base-state" title="패턴 1. BaseState 확장">
        <p>
          <InlineCode>BaseState</InlineCode>를 교차하면 dim, ESC, 외부 클릭 옵션을
          기본값과 함께 공유할 수 있습니다. 공통 동작을 가져가면서 개별 다이얼로그에
          필요한 필드는 자유롭게 추가하세요.
        </p>
        <CodeBlock language="ts" code={basePatternSnippet} />
      </Section>

      <Section
        as="h3"
        id="pattern-layered"
        title="패턴 2. DialogState로 메타 필드 직접 관리"
      >
        <p>
          <InlineCode>DialogState&lt;T&gt;</InlineCode>를 직접 사용하면{' '}
          <InlineCode>BaseLayerProps</InlineCode>를 커스터마이즈하면서{' '}
          <InlineCode>id</InlineCode>, <InlineCode>isOpen</InlineCode>은 필수로 보장됩니다.
          다이얼로그별로 기본 dim 여부나 dismissable 값을 다르게 지정하고 싶을 때 유용합니다.
        </p>
        <CodeBlock language="ts" code={layeredPatternSnippet} />
      </Section>

      <Section
        as="h3"
        id="pattern-raw"
        title="패턴 3. 최소 Payload만 선언"
      >
        <p>
          가장 단순한 형태로 <InlineCode>type</InlineCode>과 필요한 필드만 선언한 뒤,
          <InlineCode>DialogState</InlineCode> 변환을 후속 단계에서 수행하는 방식입니다.
          상태 정의는 간결하지만 컴포넌트 쪽에서 메타 필드를 수동으로 합쳐야 하므로,
          공통 동작이 거의 없을 때만 권장합니다.
        </p>
        <CodeBlock language="ts" code={directPayloadSnippet} />
      </Section>
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
          <b>흐름 한눈에 보기</b>: 상태 선언 → 컴포넌트 props 타입 →{' '}
          <InlineCode>useDialogs</InlineCode> 반환값을 연결해 한 파일에서 확인하면
          타입 계약이 깨졌을 때 빠르게 발견할 수 있습니다.
        </li>
        <li>
          <b>필수 체크리스트</b>: 각 다이얼로그는 고유한 <InlineCode>type</InlineCode>을 유지하고,
          필요한 필드만 선언하세요. <InlineCode>DialogPatch</InlineCode>를 사용할 때는
          <InlineCode>id</InlineCode>, <InlineCode>type</InlineCode>,{' '}
          <InlineCode>isOpen</InlineCode>을 수정하지 않는지 확인합니다.
        </li>
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
