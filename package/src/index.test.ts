import { describe, it, expect } from 'vitest';
import { DialogStore } from './store';
import { createDialogApi, type DialogComponent } from './registry';
import type { DialogRenderFn } from './types';

type TestDialogProps = {
  message: string;
  step?: 'idle' | 'done';
};

const TestDialog = (({ message }: TestDialogProps) => {
  return message ? null : null;
}) satisfies DialogComponent<TestDialogProps>;

describe('DialogStore', () => {
  it('open adds entry and allows updates', () => {
    const store = new DialogStore();
    const renderer: DialogRenderFn<TestDialogProps> = () => null;

    const handle = store.open(renderer, { zIndex: 2000 });
    const snapshot = store.getSnapshot();

    expect(snapshot.entries).toHaveLength(1);
    expect(snapshot.entries[0].zIndex).toBe(2000);
    expect(snapshot.entries[0].isOpen).toBe(true);

    handle.update({ message: 'hello', step: 'idle' });
    const updated = store.getSnapshot().entries[0];

    expect(updated.state).toMatchObject({ message: 'hello', step: 'idle' });

    handle.close();
    expect(store.getSnapshot().entries[0].isOpen).toBe(false);
  });

  it('openAsync resolves via async handlers', async () => {
    const store = new DialogStore();
    const promise = store.openAsync(() => null);

    const entry = store.getSnapshot().entries[0];
    expect(entry.asyncHandlers).toBeDefined();

    entry.asyncHandlers?.resolve({ ok: true });
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.dialog.id).toBe(entry.id);
  });
});

describe('createDialogApi', () => {
  it('opens sync dialogs and exposes control helpers', () => {
    const store = new DialogStore();
    const dialog = createDialogApi(
      store,
      {
        test: { component: TestDialog, mode: 'sync' },
      } as const
    );

    const result = dialog.test({ message: 'hello' });

    expect(store.getSnapshot().entries).toHaveLength(1);

    result.update({ message: 'hello' });
    expect(store.getSnapshot().entries[0].state).toMatchObject({ message: 'hello' });

    result.setStatus('done');
    expect(store.getSnapshot().entries[0].meta.status).toBe('done');

    result.close();
    expect(store.getSnapshot().entries[0].isOpen).toBe(false);
  });

  it('supports async dialogs via registry options', async () => {
    const AsyncDialog = ((props: TestDialogProps) => {
      return props.step ? null : null;
    }) satisfies DialogComponent<TestDialogProps>;

    const store = new DialogStore();
    const dialog = createDialogApi(
      store,
      {
        confirm: { component: AsyncDialog, mode: 'async' },
      } as const
    );

    const promise = dialog.confirm({ message: 'are you sure?' });

    const entry = store.getSnapshot().entries[0];
    expect(entry.asyncHandlers).toBeDefined();

    entry.asyncHandlers?.resolve({ ok: true });
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(result.options.zIndex).toBeDefined();
  });

  it('respects baseZIndex option when provided', () => {
    const store = new DialogStore({ baseZIndex: 5000 });
    store.open(() => null);
    store.open(() => null);

    const entries = store.getSnapshot().entries;
    expect(entries[0].zIndex).toBe(5000);
    expect(entries[1].zIndex).toBe(5001);
  });
});
