import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { MainLayout } from '@/components/layout/MainLayout';

// 페이지 컴포넌트 임포트 (누락된 부분 추가)
import { Introduction } from '@/pages/Introduction';
import { UsageExamples } from '@/pages/examples/UsageExamples';
import { CustomDialog } from '@/pages/examples/CustomDialog';
import { CoreSetup } from '@/pages/examples/CoreSetup';
import { QuickStart } from '@/pages/examples/QuickStart';

function App() {
  // 1. useDialogs 훅으로부터 완벽한 타입을 가진 dialogs 배열을 가져옵니다.
  const { dialogs } = useDialogs();

  useEffect(() => {
    console.log(
      '%c[React Layered Dialog] %cState Changed:',
      'color: #7c3aed; font-weight: bold;',
      'color: inherit;',
      dialogs
    );
  }, [dialogs]);

  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/examples/quick-start" element={<QuickStart />} />
          <Route path="/examples/usage" element={<UsageExamples />} />
          <Route path="/examples/custom" element={<CustomDialog />} />
          <Route path="/examples/setup" element={<CoreSetup />} />
        </Routes>
      </MainLayout>

      {/* 2. dialogs 배열을 prop으로 전달합니다. */}
      <DialogRenderer dialogs={dialogs} />
    </>
  );
}

export default App;
