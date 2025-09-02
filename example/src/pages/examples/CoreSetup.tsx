import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <InlineCode>DialogRenderer</InlineCode>는 다이얼로그 상태를 실제
        컴포넌트로 렌더링하는 역할을 합니다. 애니메이션이 필요 없다면 기본
        버전을, 부드러운 등장/퇴장 효과를 원한다면{' '}
        <InlineCode>motion</InlineCode> 라이브러리를 사용하는 애니메이션 버전을
        선택하세요.
      </TypographyP>
      <Tabs defaultValue="basic" className="mt-4">
        <TabsList>
          <TabsTrigger value="basic">기본 (애니메이션 없음)</TabsTrigger>
          <TabsTrigger value="animated">애니메이션</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-2">
          <CodeBlock
            language="tsx"
            code={`// components/dialogs/DialogRenderer.tsx

import { useDialogs } from '@/lib/dialogs';

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    <>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </>
  );
};
`}
          />
        </TabsContent>
        <TabsContent value="animated" className="mt-2">
          <TypographyP className="text-sm text-muted-foreground mb-2">
            애니메이션을 사용하려면{' '}
            <InlineCode>motion</InlineCode> 라이브러리를 설치해야 합니다:{' '}
            <InlineCode>pnpm add motion</InlineCode>
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
        </TabsContent>
      </Tabs>
    </div>

    <div>
      <TypographyH3>
        3. <InlineCode>App.tsx</InlineCode>: 앱에 적용하기
      </TypographyH3>
      <TypographyP className="mt-2">
        마지막으로, 선택한 버전의 <InlineCode>DialogRenderer</InlineCode>를
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
