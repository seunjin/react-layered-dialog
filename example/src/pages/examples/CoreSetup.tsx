import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/ui/typography';

export const CoreSetup = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>라이브러리 핵심 설정</TypographyH2>
      <TypographyP className="mt-2">
        <InlineCode>react-layered-dialog</InlineCode>를 사용하기 위해서는 두
        가지 핵심 파일을 설정해야 합니다: 다이얼로그의 종류와 로직을 정의하는
        <InlineCode>lib/dialogs.ts</InlineCode>
        와, 다이얼로그를 실제로 화면에 렌더링하는
        <InlineCode>DialogRenderer.tsx</InlineCode>
        입니다. 이 페이지에서 전체 설정 과정을 안내합니다.
      </TypographyP>
    </div>

    <div>
      <TypographyH3>
        1. <InlineCode>lib/dialogs.ts</InlineCode>: 다이얼로그 시스템 정의
      </TypographyH3>
      <TypographyP className="mt-2">
        이 파일은 라이브러리와 애플리케이션을 연결하는 허브 역할을 합니다. 아래
        코드와 같이 5단계에 걸쳐 다이얼로그의 타입, 상태, 컴포넌트 매핑을
        정의하고 앱 전체에서 사용할 <InlineCode>useDialogs</InlineCode> 훅을
        생성합니다.
      </TypographyP>
      <CodeBlock
        language="typescript"
        code={`// lib/dialogs.ts

import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';
import type React from 'react';

// 1. 다이얼로그 타입 정의 (Type Definition)
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

// 2. 상태 유니온 (State Union)
export type CustomDialogState = AlertState | ConfirmState;

// 3. 매니저 생성 (Manager Creation)
const { manager } = createDialogManager<CustomDialogState>();

// 4. 컴포넌트 맵핑 (Component Mapping)
const componentMap = {
  alert: Alert,
  confirm: Confirm,
};

// 5. 훅 생성 및 내보내기 (Hook Creation & Export)
export const useDialogs = createUseDialogs(manager, componentMap);
export const closeDialog = manager.closeDialog;
`}
      />
    </div>

    <div>
      <TypographyH3>
        2. <InlineCode>DialogRenderer.tsx</InlineCode>: 렌더링 레이어
      </TypographyH3>
      <TypographyP className="mt-2">
        <InlineCode>DialogRenderer</InlineCode>는
        <InlineCode>useDialogs</InlineCode> 훅이 관리하는 다이얼로그 상태 배열을
        구독하고, 실제 React 컴포넌트로 변환하여 화면에 렌더링합니다. 이
        컴포넌트는 앱의 최상위 레이어에 한 번만 포함되면 됩니다.
      </TypographyP>
      <CodeBlock
        language="tsx"
        code={`// components/dialogs/DialogRenderer.tsx

import { AnimatePresence } from 'motion/react';
import { useDialogs } from '@/lib/dialogs';

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};
`}
      />
    </div>

    <div>
      <TypographyH3>
        3. <InlineCode>App.tsx</InlineCode>: 앱에 적용하기
      </TypographyH3>
      <TypographyP className="mt-2">
        마지막으로, 생성한 <InlineCode>DialogRenderer</InlineCode>를
        애플리케이션의 최상위 컴포넌트(일반적으로 `App.tsx`)에 추가합니다.
        이렇게 하면 앱 어디에서든 <InlineCode>openDialog</InlineCode>를 호출하여
        다이얼로그를 열 수 있습니다.
      </TypographyP>
      <CodeBlock
        language="tsx"
        code={`// App.tsx

import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { MainLayout } from '@/components/layout/MainLayout';
import { Routes, Route } from 'react-router-dom';
// ... other imports

function App() {
  return (
    <>
      <MainLayout>
        <Routes>{/* ... routes ... */}</Routes>
      </MainLayout>
      
      {/* DialogRenderer를 앱 최상단에 추가 */}
      <DialogRenderer />
    </>
  );
}
`}
      />
    </div>
  </div>
);
