import { useEffect } from 'react';

export type UseLayerBehaviorOptions = {
  id?: string;
  zIndex?: number;
  getTopZIndex: () => number | undefined;

  closeOnEscape?: boolean;
  onEscape?: () => void;

  autoFocus?: boolean;
  focusRef?: React.RefObject<HTMLElement | null>;

  closeOnOutsideClick?: boolean;
  onOutsideClick?: () => void;
  // 외부 클릭 감지를 위한 ref를 직접 받도록 수정
  outsideClickRef?: React.RefObject<Element | null>;
};

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