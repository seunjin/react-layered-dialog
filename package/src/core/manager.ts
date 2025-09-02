// manager.ts
import type { DialogState, Listener } from './types';

let dialogIdCounter = 0;

/**
 * 다이얼로그 상태를 관리하는 핵심 클래스.
 * 다이얼로그의 열기, 닫기, 상태 변경 감지 기능을 제공합니다.
 */
export class DialogManager<T extends { type: string }> {
  private dialogs: DialogState<T>[] = [];
  private listeners: Set<Listener> = new Set();
  private baseZIndex: number;

  constructor(baseZIndex = 1000) {
    this.baseZIndex = baseZIndex;
  }

  // 외부 스토어 구독 (useSyncExternalStore 용)
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // 현재 상태 스냅샷 반환 (useSyncExternalStore 용)
  getSnapshot = (): DialogState<T>[] => {
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

    const newDialog: DialogState<T> = {
      ...state,
      id,
      isOpen: true,
      zIndex: this.baseZIndex + this.dialogs.length,
    };

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
      this.dialogs = this.dialogs.filter((d) => d.id !== id);
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
    this.emitChange();
  };
}