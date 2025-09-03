import { CodeBlock } from '@/components/ui/CodeBlock';
import { InlineCode } from '@/components/ui/InlineCode';
import {
  TypographyH2,
  TypographyH3,
  TypographyP,
} from '@/components/ui/typography';

const dialogsTsCode = `// src/lib/dialogs.ts
import {
  createDialogManager,
  createUseDialogs,
  type BaseState,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';

// 1. 다이얼로그 상태 타입 정의
export interface AlertState extends BaseState {
  type: 'alert';
  title: string;
  message: string;
}

// 2. 모든 다이얼로그 상태 타입을 포함하는 유니온 타입 생성
export type CustomDialogState = AlertState;

// 3. 다이얼로그 매니저 생성
const { manager } = createDialogManager<CustomDialogState>();

// 4. 다이얼로그 타입과 컴포넌트를 매핑하는 객체 생성
const componentMap = {
  alert: Alert,
};

// 5. 앱 전체에서 사용할 훅과 함수 생성 및 내보내기
export const useDialogs = createUseDialogs(manager, componentMap);
export const openDialog = manager.openDialog;
export const closeDialog = manager.closeDialog;
`;

const alertComponentCode = `// src/components/dialogs/Alert.tsx
import { closeDialog } from '@/lib/dialogs';
import type { AlertState } from '@/lib/dialogs';
import type { DialogState } from 'react-layered-dialog';

type AlertProps = DialogState<AlertState>;

export const Alert = ({ title, message, zIndex }: AlertProps) => {
  return (
    <div style={{ zIndex }}>
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black/30" />
      
      {/* 다이얼로그 패널 */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          <button 
            onClick={closeDialog} 
            className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
`;

const dialogRendererCode = `// src/components/dialogs/DialogRenderer.tsx
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
`;

const appTsxCode = `// src/App.tsx
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
// ... other imports

function App() {
  return (
    <>
      {/* 앱의 메인 콘텐츠 */}
      <MainLayout>
        {/* ... 라우트 ... */}
      </MainLayout>
      
      {/* DialogRenderer를 앱 최상단에 추가 */}
      <DialogRenderer />
    </>
  );
}
`;

const usageCode = `// MyComponent.tsx
import { openDialog } from '@/lib/dialogs';

const MyComponent = () => {
  const showAlert = () => {
    openDialog('alert', {
      title: '안녕하세요!',
      message: '이것은 react-layered-dialog를 사용한 알림창입니다.',
    });
  };

  return <button onClick={showAlert}>알림창 열기</button>;
};
`;

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
