import {
  TypographyH2,
  TypographyP,
} from '@/components/ui/typography';
import type { ReactNode } from 'react';

const CodeBlock = ({ children }: { children: ReactNode }) => (
  <pre className="mt-2 rounded-md bg-muted p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
    <code>{children}</code>
  </pre>
);

export const CoreSetup = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>핵심 파일 설정: dialogs.ts</TypographyH2>
      <TypographyP>
        `dialogs.ts` 파일은 라이브러리와 애플리케이션을 연결하는 핵심적인 역할을 합니다. 이곳에서 다이얼로그의 종류와 상태(state)를 정의하고, `useDialogs` 훅을 생성하여 앱 전체에서 사용할 수 있도록 설정합니다.
      </TypographyP>
    </div>

    <div>
      <CodeBlock>
{`import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import { Modal } from '@/components/dialogs/Modal';
import type React from 'react';

// 1. 각 다이얼로그의 상태 타입을 BaseState를 확장하여 정의합니다.
export interface AlertState extends BaseState {
  type: 'alert';
  title: string;
  message: string;
  onOk?: () => void;
}

export interface ConfirmState extends BaseState {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ModalState extends BaseState {
  type: 'modal';
  children: React.ReactNode;
}

// 2. 모든 상태 타입을 유니온으로 결합하고 export 합니다.
export type CustomDialogState = AlertState | ConfirmState | ModalState;

// 3. 다이얼로그 관리 시스템의 핵심을 생성합니다. (필요 시 zIndex 설정 가능)
const { manager } = createDialogManager<CustomDialogState>({
  // baseZIndex: 2000, // 예시: z-index 시작 값 변경
});

// 4. 'type'과 컴포넌트를 매핑하는 객체를 만듭니다.
const componentMap = {
  alert: Alert,
  confirm: Confirm,
  modal: Modal,
};

// 5. 라이브러리가 제공하는 팩토리를 사용하여 최종 
useDialogs> 훅을 생성합니다.
export const useDialogs = createUseDialogs(manager, componentMap);

// 6. 컴포넌트에서 사용할 수 있도록 close 함수들을 export 합니다.
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;`}
      </CodeBlock>
    </div>
  </div>
);
