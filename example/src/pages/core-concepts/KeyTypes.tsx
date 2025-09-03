import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead,
} from '@/components/ui/typography';

const baseLayerPropsCode = `export interface BaseLayerProps {
  /**
   * 레이어의 쌓임 순서(z-index)입니다.
   * 지정하지 않으면 \`baseZIndex\`(기본값 1000)부터 시작하는 값이 자동으로 할당됩니다.
   */
  zIndex?: number;
  /**
   * 레이어 뒤에 깔리는 어두운 배경(dim)을 표시할지 여부입니다.
   * @default true
   */
  dimmed?: boolean;
  /**
   * 오버레이(배경) 클릭 시 레이어를 닫을지 여부입니다.
   * \`useLayerBehavior\` 훅의 \`closeOnOutsideClick\` 옵션을 통해 구현됩니다.
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Escape 키를 눌렀을 때 레이어를 닫을지 여부입니다.
   * \`useLayerBehavior\` 훅의 \`closeOnEscape\` 옵션을 통해 구현됩니다.
   * @default true
   */
  dismissable?: boolean;
}`;

const customDialogStateCode = `// 1. 각 다이얼로그의 고유한 상태와 설정을 정의합니다.
//    모든 인터페이스는 BaseLayerProps를 확장해야 합니다.
export interface AlertState extends BaseLayerProps {
  type: 'alert';
  title: string;
  message: string;
  onOk?: () => void;
}
export interface ConfirmState extends BaseLayerProps {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// 2. 모든 상태 타입을 TypeScript의 유니온 타입으로 결합합니다.
//    이것이 앱의 전체 다이얼로그 상태를 나타내는 타입이 됩니다.
export type CustomDialogState = AlertState | ConfirmState;`;

const dialogStateCode = `export type DialogState<T> = T & {
  id: string;
  isOpen: boolean;
};

// 예시: Alert 컴포넌트가 받는 최종 props 타입
// DialogState<AlertState>는 아래와 같은 타입을 가집니다.
// {
//   id: string;
//   isOpen: boolean;
//   type: 'alert';
//   title: string;
//   message: string;
//   onOk?: () => void;
//   zIndex?: number;
//   ... (BaseLayerProps의 나머지 속성들)
// }`;

export const KeyTypes = () => (
  <div className="space-y-12">
    <div>
      <TypographyH2>Key Types</TypographyH2>
      <TypographyLead>
        라이브러리를 타입스크립트와 함께 안전하게 사용하기 위해 알아야 할 핵심
        타입들입니다.
      </TypographyLead>
    </div>

    <div className="space-y-4">
      <TypographyH3>BaseLayerProps</TypographyH3>
      <TypographyP>
        <InlineCode>BaseLayerProps</InlineCode>는 모든 레이어 컴포넌트가 공통적으로
        가지는 표준 설정(props)을 정의하는 인터페이스입니다. 다이얼로그의 동작
        방식(`dismissable` 등)을 제어하는 옵션들을 포함합니다. 새로운 다이얼로그
        타입을 정의할 때는 반드시 이 인터페이스를 확장해야 합니다.
      </TypographyP>
      <CodeBlock language="typescript" code={baseLayerPropsCode} />
    </div>

    <div className="space-y-4">
      <TypographyH3>CustomDialogState (유니온 타입)</TypographyH3>
      <TypographyP>
        이 타입은 사용자가 직접 정의하는 타입입니다. 앱에서 사용될 모든
        다이얼로그의 상태 인터페이스(<InlineCode>AlertState</InlineCode>,
        <InlineCode>ConfirmState</InlineCode> 등)를 TypeScript의 유니온(|)으로
        결합한 형태입니다. 이 타입을 통해 라이브러리는 앱의 전체 다이얼로그
        상태를 이해하고, <InlineCode>type</InlineCode> 속성을 기준으로 타입을
        정확하게 추론할 수 있습니다 (Discriminated Union).
      </TypographyP>
      <CodeBlock language="typescript" code={customDialogStateCode} />
    </div>

    <div className="space-y-4">
      <TypographyH3>DialogState&lt;T&gt;</TypographyH3>
      <TypographyP>
        <InlineCode>DialogState</InlineCode>는 라이브러리가 내부적으로 사용하는
        제네릭 유틸리티 타입입니다. 사용자가 정의한 상태 타입(`T`)에 라이브러리
        관리에 필요한 <InlineCode>id</InlineCode>와
        <InlineCode>isOpen</InlineCode> 속성을 추가합니다. 실제 다이얼로그
        컴포넌트가 최종적으로 받는 props의 타입은 바로
        <InlineCode>DialogState&lt;YourStateType&gt;</InlineCode> 입니다.
      </TypographyP>
      <CodeBlock language="typescript" code={dialogStateCode} />
    </div>
  </div>
);