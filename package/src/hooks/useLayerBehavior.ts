import { useEffect, useMemo } from 'react';

/**
 * `useLayerBehavior` 훅에 전달할 옵션 타입입니다.
 */
export type UseLayerBehaviorOptions = {
  /**
   * 동작을 적용할 레이어의 고유 ID입니다. (디버깅용)
   */
  id?: string;
  /**
   * 현재 열려있는 모든 다이얼로그의 상태 배열입니다.
   * 이 배열을 기반으로 훅이 스스로 최상단 z-index를 계산합니다.
   */
  dialogs: readonly { state: { zIndex?: number } }[];
  /**
   * 동작을 적용할 레이어의 z-index 값입니다.
   * 최상단 레이어 여부를 판단하는 데 사용됩니다.
   */
  zIndex?: number;
  /**
   * Escape 키로 레이어를 닫는 동작을 활성화할지 여부입니다.
   * @default false
   */
  closeOnEscape?: boolean;
  /**
   * Escape 키를 눌렀을 때 실행될 콜백 함수입니다.
   */
  onEscape?: () => void;

  /**
   * 레이어가 마운트될 때 특정 요소에 자동으로 포커스를 주는 동작을 활성화할지 여부입니다.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * `autoFocus`가 true일 때, 포커스를 받을 요소의 ref 객체입니다.
   */
  focusRef?: React.RefObject<HTMLElement | null>;

  /**
   * 레이어 외부를 클릭했을 때 닫는 동작을 활성화할지 여부입니다.
   * @default false
   */
  closeOnOutsideClick?: boolean;
  /**
   * 레이어 외부를 클릭했을 때 실행될 콜백 함수입니다.
   */
  onOutsideClick?: () => void;
  /**
   * 외부 클릭을 감지할 기준 요소의 ref 객체입니다.
   * 이 요소의 바깥 영역을 클릭하면 `onOutsideClick` 콜백이 호출됩니다.
   */
  outsideClickRef?: React.RefObject<Element | null>;
};

/**
 * 레이어 컴포넌트의 공통 동작(behavior)을 캡슐화하는 훅입니다.
 */
export function useLayerBehavior(opts: UseLayerBehaviorOptions) {
  const {
    dialogs,
    zIndex,
    closeOnEscape = false,
    onEscape,
    autoFocus = false,
    focusRef,
    closeOnOutsideClick = false,
    onOutsideClick,
    outsideClickRef,
  } = opts;

  // dialogs 배열이 변경될 때만 최상단 z-index를 다시 계산합니다.
  const topZIndex = useMemo(() => {
    if (dialogs.length === 0) return undefined;
    return dialogs.reduce((maxZ, d) => Math.max(maxZ, d.state.zIndex ?? 0), 0);
  }, [dialogs]);

  // ESC 처리
  useEffect(() => {
    if (!closeOnEscape || zIndex === undefined) return;
    if (typeof document === 'undefined') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (topZIndex == null) return;
      if (topZIndex === zIndex) onEscape?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, onEscape, zIndex, topZIndex]);

  // 마운트 시 포커스
  useEffect(() => {
    if (!autoFocus) return;
    focusRef?.current?.focus?.();
  }, [autoFocus, focusRef]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (
      !closeOnOutsideClick ||
      typeof document === 'undefined' ||
      !outsideClickRef?.current ||
      zIndex === undefined
    )
      return;

    const onMouseDown = (e: MouseEvent) => {
      const root = outsideClickRef.current;
      if (!root) return;
      if (topZIndex !== zIndex) return;
      if (!root.contains(e.target as Node)) {
        onOutsideClick?.();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, onOutsideClick, outsideClickRef, zIndex, topZIndex]);
}
