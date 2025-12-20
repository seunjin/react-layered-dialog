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

    // getProp, getProps 테스트
    expect(handle.getProp('message', 'fallback')).toBe('hello');
    expect(handle.getProp('non-existent', 'fallback')).toBe('fallback');
    expect(handle.getProps({ message: 'default', extra: 'foo' })).toMatchObject({
      message: 'hello',
      extra: 'foo',
    });

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

  it('openAsync resolves with custom data', async () => {
    const store = new DialogStore();
    type MyData = { value: string };
    const promise = store.openAsync<Record<string, never>, MyData>(() => null);

    const entry = store.getSnapshot().entries[0];
    entry.asyncHandlers?.resolve({ ok: true, data: { value: 'hello' } });

    const result = await promise;
    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ value: 'hello' });
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
    expect(result.zIndex).toBeDefined();
  });

  it('generates IDs using registry keys and individual sequences', () => {
    const store = new DialogStore();
    const dialog = createDialogApi(store, {
      confirm: { component: TestDialog, mode: 'sync' },
      alert: { component: TestDialog, mode: 'sync' },
    } as const);

    const c1 = dialog.confirm({ message: 'c1' });
    const c2 = dialog.confirm({ message: 'c2' });
    const a1 = dialog.alert({ message: 'a1' });

    expect(c1.dialog.id).toBe('confirm-0');
    expect(c2.dialog.id).toBe('confirm-1');
    expect(a1.dialog.id).toBe('alert-0');

    // 명시적 ID 지정 시 우선순위 확인
    const manual = dialog.confirm({ message: 'custom' }, { id: 'manual-id' });
    expect(manual.dialog.id).toBe('manual-id');

    // 수동 지정 이후에도 시퀀스는 독립적으로 예약됨 (다음은 confirm-2)
    const c3 = dialog.confirm({ message: 'c3' });
    expect(c3.dialog.id).toBe('confirm-2');
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
