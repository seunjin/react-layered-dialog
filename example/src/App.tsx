import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';

function App() {
  const { openDialog, closeDialog } = useDialogs();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          React Layered Dialog
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A flexible and powerful dialog management library for React.
        </p>
      </header>

      <main className="grid gap-8">
        {/* Section 1: Basic Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
            <CardDescription>
              Open different types of dialogs with a simple API.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            <button
              onClick={() => openDialog('alert', { title: 'Alert', message: 'This is an alert dialog.' })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Alert
            </button>
            <button
              onClick={() => {
                const id = openDialog('confirm', {
                  title: 'Confirm',
                  message: 'Do you want to proceed?',
                  onConfirm: () => alert('Confirmed!'),
                  onCancel: () => closeDialog(id),
                });
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Open Confirm
            </button>
            <button
              onClick={() => openDialog('modal', { children: <p>This is a modal.</p> })}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Open Modal
            </button>
          </CardContent>
        </Card>

        {/* TODO: Add more sections for Advanced Closing, Async Flows, etc. */}
      </main>

      {/* Dialog Renderer */}
      <DialogRenderer />
    </div>
  );
}

export default App;