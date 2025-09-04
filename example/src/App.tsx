import { useEffect } from 'react';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { MainLayout } from './components/layout/MainLayout';
import { SidebarProvider } from './components/ui/sidebar';

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
    <SidebarProvider>
      <MainLayout />
      <DialogRenderer dialogs={dialogs} />
    </SidebarProvider>
  );
}

export default App;