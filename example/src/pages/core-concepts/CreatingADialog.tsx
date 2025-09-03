import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/docs/typography';

const dialogsTsCode = `// src/lib/dialogs.ts
import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// 1. 다이얼로그 타입 정의 (Type Definition)
// BaseState를 확장하여 id, zIndex 등 기본 상태를 포함시킵니다.
export interface AlertState extends BaseState {
  type: 'alert';
  title: string;
  message: string;
}
export interface ConfirmState extends BaseState {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm: () => void;
}
export interface ModalState extends BaseState {
  type: 'modal';
  children: React.ReactNode;
  // Modal 컴포넌트에서 사용할 추가적인 props
  dimmed?: boolean;
  closeOnOverlayClick?: boolean;
}

// 2. 상태 유니온 (State Union)
// Discriminated Union 패턴을 사용하여 type 속성으로 각 상태를 구별합니다.
export type CustomDialogState = AlertState | ConfirmState | ModalState;

// 3. 매니저 생성 (Manager Creation)
const { manager } = createDialogManager<CustomDialogState>();

// 4. 컴포넌트 맵핑 (Component Mapping)
// 다이얼로그 type과 실제 렌더링될 React 컴포넌트를 연결합니다.
const componentMap = {
  alert: Alert,
  confirm: Confirm,
  modal: Modal,
};

// 5. 훅 생성 및 내보내기 (Hook Creation & Export)
export const useDialogs = createUseDialogs(manager, componentMap);
export const openDialog = manager.openDialog;
export const closeDialog = manager.closeDialog;
export const updateDialog = manager.updateDialog;
`;

export const CreatingADialog = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>Creating a Dialog</TypographyH2>
      <TypographyP className="mt-2">
        <InlineCode>react-layered-dialog</InlineCode>의 핵심은{' '}
        <InlineCode>src/lib/dialogs.ts</InlineCode> 파일에 있습니다. 이
        파일에서 5단계에 걸쳐 애플리케이션의 다이얼로그 시스템을 정의합니다.
      </TypographyP>
    </div>

    <div className="space-y-6">
      <div>
        <TypographyH3>1. 다이얼로그 타입 정의</TypographyH3>
        <TypographyP>
          앱에서 사용할 각 다이얼로그의 상태(<InlineCode>props</InlineCode>)를
          TypeScript 인터페이스로 정의합니다. 모든 인터페이스는 라이브러리의{' '}
          <InlineCode>BaseState</InlineCode>를 확장해야 하며, 고유한{' '}
          <InlineCode>type</InlineCode> 문자열 리터럴을 가져야 합니다.
        </TypographyP>
      </div>
      <div>
        <TypographyH3>2. 상태 유니온 생성</TypographyH3>
        <TypographyP>
          정의한 모든 상태 인터페이스를 TypeScript의 유니온 타입으로 결합합니다.
          이 &quot;Discriminated Union&quot; 패턴을 통해 <InlineCode>type</InlineCode> 속성을
          기준으로 타입 추론이 가능해져 타입 안정성이 극대화됩니다.
        </TypographyP>
      </div>
      <div>
        <TypographyH3>3. 매니저 생성</TypographyH3>
        <TypographyP>
          <InlineCode>createDialogManager</InlineCode> 팩토리 함수에 상태 유니온
          타입을 제네릭으로 전달하여 다이얼로그 매니저를 생성합니다.
        </TypographyP>
      </div>
      <div>
        <TypographyH3>4. 컴포넌트 매핑</TypographyH3>
        <TypographyP>
          <InlineCode>type</InlineCode> 문자열을 키로, 실제 렌더링할 React
          컴포넌트를 값으로 하는 객체를 생성합니다.
        </TypographyP>
      </div>
      <div>
        <TypographyH3>5. 훅과 함수 생성 및 내보내기</TypographyH3>
        <TypographyP>
          <InlineCode>createUseDialogs</InlineCode>에 매니저와 컴포넌트 맵을
          전달하여 최종 <InlineCode>useDialogs</InlineCode> 훅을 생성합니다. 앱
          전체에서 다이얼로그를 쉽게 제어할 수 있도록{' '}
          <InlineCode>openDialog</InlineCode>, <InlineCode>closeDialog</InlineCode>{' '}
          등의 함수도 함께 내보냅니다.
        </TypographyP>
      </div>
    </div>

    <div>
      <TypographyH3>전체 코드 예시</TypographyH3>
      <CodeBlock language="typescript" code={dialogsTsCode} />
    </div>
  </div>
);
