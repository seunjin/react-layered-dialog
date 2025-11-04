import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { router } from './router';
import { DialogsRenderer } from 'react-layered-dialog';
import { renewalDialogStore } from '@/lib/renewalDialogs';
function App() {
  const { store } = useDialogs();

  useEffect(() => {
    const unsubscribe = renewalDialogStore.subscribe(() => {
      const snapshot = renewalDialogStore.getSnapshot();
      console.log('[renewal dialogs]', snapshot.entries);
    });
    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   console.log(
  //     '%c[React Layered Dialog] %cState Changed:',
  //     'color: #7c3aed; font-weight: bold;',
  //     'color: inherit;',
  //     dialogs
  //   );
  // }, [dialogs]);

  return (
    <>
      <RouterProvider router={router} />
      <DialogRenderer store={store} />
      <DialogsRenderer store={renewalDialogStore} />
    </>
  );
}

export default App;
