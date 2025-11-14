import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { dialogStore } from '@/lib/dialogs';
import { ReactLayeredDialogRenderer } from './components/dialogs/ReactLayeredDialogRenderer';
function App() {
  useEffect(() => {
    const unsubscribe = dialogStore.subscribe(() => {
      const snapshot = dialogStore.getSnapshot();
      console.log('[renewal dialogs]', snapshot.entries);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ReactLayeredDialogRenderer store={dialogStore} />
    </>
  );
}

export default App;
