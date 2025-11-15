import type {
  DialogEntry,
  DialogListener,
  DialogStoreSnapshot,
  DialogId,
  OpenDialogOptions,
  OpenDialogResult,
  DialogRenderFn,
  DialogAsyncResult,
  DialogAsyncResolvePayload,
  DialogStateUpdater,
  DialogStatus,
  DialogOpenResult,
} from './types';

const DEFAULT_BASE_Z_INDEX = 1000;
let dialogSeq = 0;
let componentSeq = 0;

export type DialogStoreOptions = {
  baseZIndex?: number;
};

/**
 * 다이얼로그 스택을 관리하는 핵심 스토어입니다.
 * open/close/unmount 메서드로 스택을 조작하며 외부에서 구독할 수 있습니다.
 */
export class DialogStore {
  private entries: DialogEntry[] = [];
  private listeners: Set<DialogListener> = new Set();
  private baseZIndex: number;
  private nextZIndex: number;
  private snapshot: DialogStoreSnapshot;

  constructor(options: DialogStoreOptions = {}) {
    const baseZIndex = options.baseZIndex ?? DEFAULT_BASE_Z_INDEX;
    this.baseZIndex = baseZIndex;
    this.nextZIndex = baseZIndex;
    this.snapshot = { entries: this.entries };
  }

  /**
   * 상태 변경을 구독합니다. 반환된 함수를 호출하면 구독이 해제됩니다.
   */
  subscribe = (listener: DialogListener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * 현재 스택 스냅샷을 반환합니다.
   */
  getSnapshot = (): DialogStoreSnapshot => this.snapshot;

  /**
   * 새 다이얼로그 엔트리를 생성하고 공통 전처리를 수행합니다.
   */
  private createEntry = <
    TProps extends Record<string, unknown> = Record<string, unknown>
  >(
    renderer: DialogRenderFn<TProps>,
    options: OpenDialogOptions = {},
    extras: Partial<DialogEntry> = {}
  ) => {
    const {
      id: providedId,
      componentKey: providedComponentKey,
      zIndex: providedZIndex,
    } = options;
    const id = providedId ?? `dialog-${dialogSeq++}`;
    const componentKey =
      providedComponentKey ?? `dialog-component-${componentSeq++}`;

    if (this.entries.some((entry) => entry.id === id)) {
      throw new Error(`[react-layered-dialog] Duplicate dialog id "${id}".`);
    }

    const hasCustomZIndex = typeof providedZIndex === 'number';
    const zIndex = hasCustomZIndex
      ? (providedZIndex as number)
      : this.nextZIndex++;

    if (hasCustomZIndex) {
      this.nextZIndex = Math.max(this.nextZIndex, zIndex + 1);
    }

    const baseEntry: DialogEntry = {
      id,
      renderer: renderer as DialogRenderFn,
      componentKey,
      isOpen: true,
      isMounted: true,
      zIndex,
      state: {},
      meta: {
        status: 'idle',
      },
    };

    const entry: DialogEntry = {
      ...baseEntry,
      ...extras,
    };

    return {
      entry,
      handle: { id, componentKey } as OpenDialogResult,
      zIndex,
    };
  };

  private createOpenResult = <
    TProps extends Record<string, unknown> = Record<string, unknown>
  >(
    handle: OpenDialogResult,
    zIndex: number
  ) => {
    const close = () => this.close(handle.id);
    const unmount = () => this.unmount(handle.id);
    const update = (updater: DialogStateUpdater<TProps>) => {
      this.updateState(handle.id, updater);
    };
    const setStatus = (status: DialogStatus) => {
      this.setStatus(handle.id, status);
    };
    const getStatus = () => this.getStatus(handle.id);

    const result: DialogOpenResult<TProps> = {
      dialog: handle,
      close,
      unmount,
      update,
      setStatus,
      getStatus,
      get status() {
        return getStatus();
      },
      zIndex,
    };

    return result;
  };

  
  
  /**
   * 새 다이얼로그를 스택에 추가합니다.
   *
   * @param renderer 컨트롤러를 받아 JSX를 반환하는 함수
   * @param options ID, z-index 등의 초기 옵션
   */
  open = <
    TProps extends Record<string, unknown> = Record<string, unknown>
  >(
    renderer: DialogRenderFn<TProps>,
    options: OpenDialogOptions = {}
  ): DialogOpenResult<TProps> => {
    const { entry, handle, zIndex } = this.createEntry(renderer, options);
    this.entries = [...this.entries, entry];
    this.updateSnapshot();
    this.emitChange();

    return this.createOpenResult<TProps>(handle, zIndex);
  };

  /**
   * Promise 기반 다이얼로그를 열고 결과를 반환합니다.
   */
  openAsync = <
    TProps extends Record<string, unknown> = Record<string, unknown>
  >(
    renderer: DialogRenderFn<TProps>,
    options: OpenDialogOptions = {}
  ): Promise<DialogAsyncResult<TProps>> => {
    const {
      entry,
      handle,
      zIndex,
    } = this.createEntry(renderer, options);

    let settle: ((value: DialogAsyncResult<TProps>) => void) | null =
      null;
    let rejectPromiseRef: ((reason?: unknown) => void) | null = null;
    let settled = false;

    const resolveController = (payload: DialogAsyncResolvePayload) => {
      if (settled) return;
      settled = true;
      const base = this.createOpenResult<TProps>(handle, zIndex);
      settle?.(Object.assign(base, { ok: payload.ok }));
    };

    const rejectController = (reason?: unknown) => {
      if (settled) return;
      settled = true;
      rejectPromiseRef?.(reason);
    };

    const promise = new Promise<DialogAsyncResult<TProps>>(
      (resolvePromise, rejectPromise) => {
        settle = resolvePromise;
        rejectPromiseRef = rejectPromise;
      }
    );

    entry.asyncHandlers = {
      resolve: resolveController as (
        payload: DialogAsyncResolvePayload
      ) => void,
      reject: rejectController,
    };

    this.entries = [...this.entries, entry];
    this.updateSnapshot();
    this.emitChange();

    return promise;
  };

  setStatus = (id: DialogId, status: DialogStatus) => {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry) return;
    this.updateEntry(id, {
      meta: {
        ...entry.meta,
        status,
      },
    });
  };

  getStatus = (id: DialogId): DialogStatus => {
    const entry = this.entries.find((item) => item.id === id);
    return entry?.meta.status ?? 'idle';
  };

  /**
   * 다이얼로그를 닫습니다. ID가 없으면 마지막 항목을 닫습니다.
   */
  close = (id?: DialogId) => {
    if (this.entries.length === 0) return;

    if (!id) {
      const target = this.entries[this.entries.length - 1];
      if (!target || !target.isOpen) return;
      this.updateEntry(target.id, { isOpen: false });
      return;
    }

    this.updateEntry(id, { isOpen: false });
  };

  /**
   * 다이얼로그를 스택에서 제거합니다. ID가 없으면 마지막 항목을 제거합니다.
   */
  unmount = (id?: DialogId) => {
    if (!id) {
      if (this.entries.length === 0) return;
      const target = this.entries[this.entries.length - 1];
      if (!target) return;
      this.removeEntry(target.id);
      return;
    }

    this.removeEntry(id);
  };

  /**
   * 모든 다이얼로그를 닫아 isOpen=false로 전환합니다.
   */
  closeAll = () => {
    if (this.entries.length === 0) return;
    this.entries = this.entries.map((entry) =>
      entry.isOpen
        ? {
            ...entry,
            isOpen: false,
          }
        : entry
    );
    this.updateSnapshot();
    this.emitChange();
  };

  /**
   * 모든 다이얼로그를 스택에서 제거하고 z-index 카운터를 초기화합니다.
   */
  unmountAll = () => {
    if (this.entries.length === 0) return;
    this.entries = [];
    this.nextZIndex = this.baseZIndex;
    this.updateSnapshot();
    this.emitChange();
  };

  /**
   * 다이얼로그 상태를 갱신합니다.
   * 객체 또는 updater 함수를 받아 이전 상태 기반으로 계산할 수 있습니다.
   */
  updateState = <TProps extends Record<string, unknown>>(
    id: DialogId,
    updater: DialogStateUpdater<TProps>
  ) => {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry) return;

    const currentState = (entry.state as TProps | undefined) ?? ({} as TProps);
    const nextState =
      typeof updater === 'function'
        ? updater(currentState)
        : updater;

    if (nextState == null) return;

    let finalState = nextState as Record<string, unknown>;
    if (
      typeof nextState === 'object' &&
      nextState !== null &&
      !Array.isArray(nextState)
    ) {
      const prevState =
        currentState &&
        typeof currentState === 'object' &&
        !Array.isArray(currentState)
          ? (currentState as Record<string, unknown>)
          : {};
      finalState = {
        ...prevState,
        ...(nextState as Record<string, unknown>),
      };
    }

    this.updateEntry(id, { state: finalState });
  };

  /**
   * 내부 헬퍼: 단일 엔트리에 패치를 적용합니다.
   */
  private updateEntry = (id: DialogId, patch: Partial<DialogEntry>) => {
    let changed = false;
    this.entries = this.entries.map((entry) => {
      if (entry.id !== id) return entry;
      changed = true;
      return {
        ...entry,
        ...patch,
      };
    });
    if (changed) {
      this.updateSnapshot();
      this.emitChange();
    }
  };

  /**
   * 내부 헬퍼: 엔트리를 완전히 제거합니다.
   */
  private removeEntry = (id: DialogId) => {
    const next = this.entries.filter((entry) => entry.id !== id);
    if (next.length === this.entries.length) return;
    this.entries = next;
    if (this.entries.length === 0) {
      this.nextZIndex = this.baseZIndex;
    }
    this.updateSnapshot();
    this.emitChange();
  };

  private updateSnapshot = () => {
    this.snapshot = { entries: this.entries };
  };

  /**
   * 상태 변경을 모든 구독자에게 브로드캐스트합니다.
   */
  private emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };
}
