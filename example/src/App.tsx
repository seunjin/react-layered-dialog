import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { router } from './router';
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
      <RouterProvider router={router} />
      <DialogRenderer dialogs={dialogs} />
    </>
  );
}

export default App;
