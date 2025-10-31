import type {
  DialogEntry,
  DialogListener,
  DialogStoreSnapshot,
  DialogId,
  OpenDialogOptions,
  OpenDialogResult,
  DialogRenderFn,
} from './types';

const DEFAULT_BASE_Z_INDEX = 1000;
let dialogSeq = 0;
let componentSeq = 0;

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

  constructor(baseZIndex: number = DEFAULT_BASE_Z_INDEX) {
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
   * 새 다이얼로그를 스택에 추가합니다.
   *
   * @param renderer 컨트롤러를 받아 JSX를 반환하는 함수
   * @param options ID, z-index 등의 초기 옵션
   */
  open = <
    TState = unknown,
    TOptions extends Record<string, unknown> = Record<string, unknown>
  >(
    renderer: DialogRenderFn<TState, TOptions>,
    options: OpenDialogOptions<TOptions> = {} as OpenDialogOptions<TOptions>
  ): OpenDialogResult => {
    const { id: providedId, componentKey: providedComponentKey, zIndex: providedZIndex, ...rest } = options;
    const id = providedId ?? `dialog-${dialogSeq++}`;
    const componentKey = providedComponentKey ?? `dialog-component-${componentSeq++}`;

    if (this.entries.some((entry) => entry.id === id)) {
      throw new Error(`[react-layered-dialog] Duplicate dialog id "${id}".`);
    }

    const hasCustomZIndex = typeof providedZIndex === 'number';
    const zIndex = hasCustomZIndex ? providedZIndex! : this.nextZIndex++;

    if (hasCustomZIndex) {
      this.nextZIndex = Math.max(this.nextZIndex, zIndex + 1);
    }

    const normalizedOptions: Record<string, unknown> & { zIndex: number } = {
      ...(rest as Record<string, unknown>),
      zIndex,
    };

    const entry: DialogEntry = {
      id,
      renderer: renderer as DialogRenderFn,
      componentKey,
      isOpen: true,
      isMounted: true,
      zIndex,
      state: undefined,
      options: normalizedOptions,
    };

    this.entries = [...this.entries, entry];
    this.updateSnapshot();
    this.emitChange();

    return { id, componentKey };
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
  updateState = (id: DialogId, updater: DialogEntry['state'] | ((prev: unknown) => unknown)) => {
    const entry = this.entries.find((item) => item.id === id);
    if (!entry) return;

    const nextState =
      typeof updater === 'function' ? (updater as (prev: unknown) => unknown)(entry.state) : updater;

    if (nextState == null) return;

    let finalState = nextState;
    if (
      typeof nextState === 'object' &&
      nextState !== null &&
      !Array.isArray(nextState)
    ) {
      const prevState =
        entry.state && typeof entry.state === 'object' && !Array.isArray(entry.state)
          ? (entry.state as Record<string, unknown>)
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
