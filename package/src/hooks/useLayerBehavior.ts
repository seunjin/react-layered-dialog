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
 * 레이어 컴포넌트에서 공통으로 필요한 포커스, 키보드, 외부 클릭 동작을 처리합니다.
 * @param opts 레이어 ID, z-index, 콜백 등 동작 제어 옵션
 * @returns 별도의 값을 반환하지 않으며, 사이드 이펙트로 DOM 이벤트를 관리합니다.
 */
export function useLayerBehavior(opts: UseLayerBehaviorOptions) {
  const {
    dialogs,
    zIndex,
    closeOnEscape = false,
    onEscape,
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
