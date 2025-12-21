import { useMemo, useSyncExternalStore } from 'react';
import { DialogControllerProvider, useDialogControllerInternal } from './controller';
import type { DialogStore } from './store';
import type { DialogControllerContextValue, DialogEntry } from './types';
import { getProp, getProps } from './utils';

type DialogsRendererProps = {
  /** 다이얼로그 상태를 관리하는 스토어 */
  store: DialogStore;
};

/**
 * 현재 다이얼로그가 속한 스택 메타 정보를 계산합니다.
 */
function computeStackInfo(entries: DialogEntry[], id: string) {
  const openEntries = entries.filter((entry) => entry.isOpen);
  const top = openEntries.length > 0 ? openEntries[openEntries.length - 1].id : null;
  const index = openEntries.findIndex((entry) => entry.id === id);
  return {
    topId: top,
    size: openEntries.length,
    index,
  };
}

/**
 * 다이얼로그 스토어의 스냅샷을 구독하고 개별 엔트리를 렌더링하는 컨테이너입니다.
 */
export function DialogsRenderer({ store }: DialogsRendererProps) {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  return (
    <>
      {snapshot.entries.map((entry) => (
        <DialogInstance key={entry.componentKey} store={store} entry={entry} allEntries={snapshot.entries} />
      ))}
    </>
  );
}

type DialogInstanceProps = {
  store: DialogStore;
  entry: DialogEntry;
  allEntries: DialogEntry[];
};

/**
 * 스토어 엔트리 하나를 렌더링하며 컨트롤러 컨텍스트를 주입합니다.
 */
function DialogInstance({ store, entry, allEntries }: DialogInstanceProps) {
  const controller: DialogControllerContextValue = useMemo(() => {
    const getStatus = () => store.getStatus(entry.id);

    return {
      id: entry.id,
      isOpen: entry.isOpen,
      state: entry.state,
      zIndex: entry.zIndex,
      handle: { id: entry.id, componentKey: entry.componentKey },
      stack: computeStackInfo(allEntries, entry.id),
      close: () => store.close(entry.id),
      unmount: () => store.unmount(entry.id),
      closeAll: store.closeAll,
      unmountAll: store.unmountAll,
      update: (updater) => store.update(entry.id, updater),
      getProp: <V,>(key: PropertyKey, fallback: V) => {
        return getProp(entry.state as Record<string, unknown>, key, fallback);
      },
      getProps: <T extends Record<string, unknown>>(base: T) => {
        return getProps(entry.state as Record<string, unknown>, base);
      },
      resolve: entry.asyncHandlers?.resolve as
        | ((payload: import('./types').DialogAsyncResolvePayload<unknown>) => void)
        | undefined,
      reject: entry.asyncHandlers?.reject,
      status: entry.meta?.status ?? 'idle',
      getStatus,
      setStatus: (status) => store.setStatus(entry.id, status),
    };
  }, [allEntries, entry, store]);

  return <DialogControllerProvider value={controller}>{entry.renderer(controller)}</DialogControllerProvider>;
}

/**
 * 현재 다이얼로그 컨트롤러 값을 가져오는 훅.
 * 제네릭을 통해 상태 타입을 지정할 수 있습니다.
 */
export function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>
>() {
  const controller = useDialogControllerInternal();
  return controller as DialogControllerContextValue<TProps>;
}
