import { useEffect } from 'react';

/**
 * `useLayerBehavior` 훅에 전달할 옵션 타입입니다.
 */
export type UseLayerBehaviorOptions = {
  /**
   * 동작을 적용할 레이어의 고유 ID입니다. (디버깅용)
   */
  id?: string;
  /**
   * 동작을 적용할 레이어의 z-index 값입니다.
   * 최상단 레이어 여부를 판단하는 데 사용됩니다.
   */
  zIndex?: number;
  /**
   * 현재 열려있는 모든 레이어 중 가장 높은 z-index 값을 반환하는 콜백 함수입니다.
   * 이 함수를 통해 훅은 자신이 최상단 레이어인지 판단할 수 있습니다.
   */
  getTopZIndex: () => number | undefined;

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
 * 이 훅은 `BaseLayerProps`에 선언된 동작 관련 설정을 인자로 받아,
 * 실제 DOM 이벤트 처리와 같은 명령형 구현 로직을 수행합니다.
 *
 * @example
 * useLayerBehavior({
 *   zIndex: props.zIndex,
 *   getTopZIndex: () => dialogs.at(-1)?.state?.zIndex,
 *   closeOnEscape: props.dismissable,
 *   onEscape: handleClose,
 *   // ... other options
 * });
 */
export function useLayerBehavior(opts: UseLayerBehaviorOptions) {
  const {
    zIndex,
    getTopZIndex,
    closeOnEscape = false,
    onEscape,
    autoFocus = false,
    focusRef,
    closeOnOutsideClick = false,
    onOutsideClick,
    outsideClickRef,
  } = opts;

  // ESC 처리
  useEffect(() => {
    if (!closeOnEscape || zIndex === undefined) return;
    if (typeof document === 'undefined') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const top = getTopZIndex();
      if (top == null) return;
      if (top === zIndex) onEscape?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, onEscape, zIndex, getTopZIndex]);

  // 마운트 시 포커스
  useEffect(() => {
    if (!autoFocus) return;
    focusRef?.current?.focus?.();
  }, [autoFocus, focusRef]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!closeOnOutsideClick || typeof document === 'undefined' || !outsideClickRef?.current || zIndex === undefined) return;

    const onMouseDown = (e: MouseEvent) => {
      const root = outsideClickRef.current;
      if (!root) return;
      const top = getTopZIndex();
      if (top !== zIndex) return;
      if (!root.contains(e.target as Node)) {
        onOutsideClick?.();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [closeOnOutsideClick, onOutsideClick, outsideClickRef, zIndex, getTopZIndex]);
}