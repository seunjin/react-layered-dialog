import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { MainLayout } from '@/components/layout/MainLayout';

// 페이지 컴포넌트 임포트
import { Introduction } from '@/pages/Introduction';
import { BasicDialogs } from '@/pages/examples/BasicDialogs';
import { CustomDialog } from '@/pages/examples/CustomDialog';
import { CoreSetup } from '@/pages/examples/CoreSetup';
import { RenderingLayer } from '@/pages/examples/RenderingLayer';

function App() {
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
          <Route path="/examples/basic" element={<BasicDialogs />} />
          <Route path="/examples/custom" element={<CustomDialog />} />
          <Route path="/examples/setup" element={<CoreSetup />} />
          <Route path="/examples/renderer" element={<RenderingLayer />} />
        </Routes>
      </MainLayout>
      <DialogRenderer />
    </>
  );
}

export default App;
