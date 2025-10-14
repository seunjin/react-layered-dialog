// manager.ts
import type { DialogPatch, DialogState, Listener } from './types';

let dialogIdCounter = 0;

/**
 * 다이얼로그 상태를 전역으로 관리하는 핵심 매니저입니다.
 * - `useSyncExternalStore` 기반으로 상태 변경을 구독할 수 있습니다.
 * - 필요 최소한의 스택 관리 기능만 제공하고, 나머지 정책은 호출자에게 위임합니다.
 */
export class DialogManager<T extends { type: string }> {
  private dialogs: DialogState<T>[] = [];
  private listeners: Set<Listener> = new Set();
  private baseZIndex: number;
  private nextZIndex: number;

  constructor(baseZIndex = 1000) {
    this.baseZIndex = baseZIndex;
    this.nextZIndex = baseZIndex;
  }

  /**
   * 외부 스토어 구독 (React `useSyncExternalStore`에서 사용)
   */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * 현재 상태 스냅샷 반환 (클라이언트 전용)
   */
  getSnapshot = (): DialogState<T>[] => {
    return this.dialogs;
  };

  /**
   * SSR 환경에서 사용할 서버 스냅샷 반환
   */
  getServerSnapshot = (): DialogState<T>[] => {
    return this.dialogs;
  };

  private emitChange = () => {
    this.listeners.forEach((listener) => listener());
  };

  /**
   * 새 다이얼로그를 엽니다.
   * @param state 다이얼로그에 전달될 상태 객체
   * @returns 생성된 다이얼로그의 고유 ID
   */
  openDialog = (state: T & { id?: string }): string => {
    const id = state.id ?? `dialog-${dialogIdCounter++}`;

    if (this.dialogs.some((d) => d.id === id)) {
      console.warn(
        `[react-layered-dialog] Duplicate dialog ID "${id}". This may cause unexpected behavior.`
      );
    }

    const providedZIndex = (state as unknown as Partial<DialogState<T>>).zIndex;
    const hasCustomZIndex = typeof providedZIndex === 'number';
    const zIndex = hasCustomZIndex ? providedZIndex : this.nextZIndex++;

    if (hasCustomZIndex) {
      this.nextZIndex = Math.max(this.nextZIndex, (providedZIndex as number) + 1);
    }

    const newDialog: DialogState<T> = {
      ...state,
      id,
      isOpen: true,
      zIndex,
    } as DialogState<T>;

    this.dialogs = [...this.dialogs, newDialog];
    this.emitChange();
    return id;
  };

  /**
   * 특정 ID의 다이얼로그를 닫거나, ID가 없으면 마지막 다이얼로그를 닫습니다.
   * @param id 닫을 다이얼로그의 ID (선택 사항)
   */
  closeDialog = (id?: string) => {
    if (this.dialogs.length === 0) return;

    if (id) {
      this.dialogs = this.dialogs.filter((d) => {
        if (d.id === id) {
          return false;
        }
        return true;
      });
    } else {
      this.dialogs = this.dialogs.slice(0, -1);
    }
    this.emitChange();
  };

  /**
   * 모든 다이얼로그를 닫습니다.
   */
  closeAllDialogs = () => {
    if (this.dialogs.length === 0) return;
    this.dialogs = [];
    this.nextZIndex = this.baseZIndex;
    this.emitChange();
  };

  updateDialog = (
    id: string,
    nextState:
      | DialogPatch<T>
      | ((prev: DialogState<T>) => DialogPatch<T> | null | undefined)
  ): DialogState<T> | null => {
    const index = this.dialogs.findIndex((dialog) => dialog.id === id);
    if (index === -1) return null;

    const prevDialog = this.dialogs[index];
    if (!nextState) return prevDialog;

    const computed = typeof nextState === 'function' ? nextState(prevDialog) : nextState;
    if (!computed) return prevDialog;

    const patch = computed as Partial<DialogState<T>>;

    const updatedDialog: DialogState<T> = {
      ...prevDialog,
      ...patch,
      id: prevDialog.id,
      type: prevDialog.type,
    };

    this.dialogs = this.dialogs.map((dialog, i) => (i === index ? updatedDialog : dialog));

    this.emitChange();
    return updatedDialog;
  };
}
