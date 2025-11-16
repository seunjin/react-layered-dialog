import { useEffect } from 'react';

let lockCount = 0;

const isBrowser = typeof document !== 'undefined';

const syncBodyClass = () => {
  if (!isBrowser) return;
  if (lockCount > 0) {
    document.body.classList.add('scroll-locked');
  } else {
    document.body.classList.remove('scroll-locked');
  }
};

/**
 * 다이얼로그가 열린 동안 body 스크롤을 잠그는 기본 훅입니다.
 * 여러 다이얼로그가 동시에 활성화돼도 카운트를 기준으로 클래스를 관리합니다.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    if (active) {
      lockCount += 1;
      syncBodyClass();
      return () => {
        lockCount = Math.max(0, lockCount - 1);
        syncBodyClass();
      };
    }

    // active=false일 때는 다른 다이얼로그가 없으면 클래스를 제거합니다.
    syncBodyClass();
    return;
  }, [active]);
}
