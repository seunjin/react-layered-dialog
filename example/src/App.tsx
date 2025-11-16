import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { dialog } from '@/lib/dialogs';
import { ReactLayeredDialogRenderer } from './components/dialogs/ReactLayeredDialogRenderer';
function App() {
  useEffect(() => {
    const unsubscribe = dialog.store.subscribe(() => {
      const snapshot = dialog.store.getSnapshot();
      console.log('[renewal dialogs]', snapshot.entries);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ReactLayeredDialogRenderer store={dialog.store} />
    </>
  );
}

export default App;
