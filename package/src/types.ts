import type { ReactNode } from 'react';

/**
 * 리스너가 등록되었을 때 호출되는 함수 시그니처.
 * 스토어 안에서 상태가 변경되면 `subscribe`로 등록된 모든 리스너가 호출됩니다.
 */
export type DialogListener = () => void;

/**
 * 다이얼로그를 렌더링할 때 호출되는 함수입니다.
 * 컨트롤러 컨텍스트를 인자로 전달해 사용자 컴포넌트가 제어 메서드에 접근할 수 있게 합니다.
 */
export type DialogRenderFn<
  TProps extends Record<string, unknown> = Record<string, unknown>
> = (controller: DialogControllerContextValue<TProps>) => ReactNode;

/**
 * 다이얼로그 고유 식별자 타입.
 */
export type DialogId = string;

/**
 * 스토어에 저장되는 다이얼로그 엔트리의 스냅샷입니다.
 */
export interface DialogEntry {
  /** 다이얼로그 고유 ID */
  id: DialogId;
  /** 렌더링 함수. 컨테이너가 컨텍스트를 주입해 호출합니다. */
  renderer: DialogRenderFn;
  /**
   * React 리렌더링을 위한 고유 Key.
   * 동일한 ID라도 재마운트가 필요하면 key를 갱신합니다.
   */
  componentKey: string;
  /** 다이얼로그가 열려 있는지 여부. 닫힘 애니메이션 제어에 사용됩니다. */
  isOpen: boolean;
  /** z-index 값. 지정하지 않으면 Store가 자동으로 증가시키며 부여합니다. */
  zIndex: number;
  /** 사용자 정의 상태. `update`를 통해 변경되며 컨트롤러를 통해 노출됩니다. */
  state: Record<string, unknown>;
  /** 비동기 다이얼로그 제어를 위한 핸들러 */
  asyncHandlers?: DialogAsyncEntryHandlers;
  /** 내부 메타 데이터 (로딩 등) */
  meta: DialogEntryMeta;
}

export interface DialogEntryMeta {
  status: DialogStatus;
}

export type DialogStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * 현재 다이얼로그 스택에 대한 메타 정보입니다.
 */
export interface DialogStackInfo {
  /** 현재 열려 있는 다이얼로그 중 최상단 ID */
  topId: DialogId | null;
  /** 열린 다이얼로그의 개수 */
  size: number;
  /** 열린 다이얼로그 목록에서 현재 다이얼로그의 인덱스 */
  index: number;
}

/**
 * 다이얼로그 상태 업데이트 인자 타입입니다.
 */
export type DialogStateUpdater<TProps extends Record<string, unknown> = Record<string, unknown>> =
  | TProps
  | Partial<TProps>
  | ((prev: TProps) => TProps | Partial<TProps> | null | undefined);

/**
 * 비동기 다이얼로그에서 resolve로 전달되는 페이로드 형태입니다.
 * @template T 비동기 결과 데이터 타입
 */
export type DialogAsyncResolvePayload<T = unknown> = {
  ok: boolean;
  data?: T;
};

/**
 * 비동기 다이얼로그 호출 결과입니다.
 */
export type DialogOpenResult<
  TProps extends Record<string, unknown> = Record<string, unknown>
> = {
  dialog: OpenDialogResult;
  close: () => void;
  unmount: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  setStatus: (status: DialogStatus) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  zIndex: number;
  /** 특정 필드 값을 안전하게 조회합니다. */
  getProp: <V>(key: PropertyKey, fallback: V) => V;
  /** 현재 state를 주어진 기본 객체와 병합해 반환합니다. */
  getProps: <T extends Record<string, unknown>>(base: T) => T;
};

export type DialogAsyncResult<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TData = unknown
> = DialogOpenResult<TProps> & DialogAsyncResolvePayload<TData>;

/**
 * 비동기 다이얼로그를 위해 엔트리에 저장되는 핸들러 모음입니다.
 */
export interface DialogAsyncEntryHandlers<TData = unknown> {
  resolve: (payload: DialogAsyncResolvePayload<TData>) => void;
  reject: (reason?: unknown) => void;
}

/**
 * 컨텍스트 훅으로 노출되는 컨트롤러 값의 형태입니다.
 */
export interface DialogControllerContextValue<
  TProps extends Record<string, unknown> = Record<string, unknown>
> {
  /** 다이얼로그 ID */
  id: DialogId;
  /** 다이얼로그가 현재 열려 있는지 여부 */
  isOpen: boolean;
  /** 현재 다이얼로그의 사용자 정의 상태 */
  state: TProps;
  /** 다이얼로그의 z-index 메타 */
  zIndex: number;
  /** 다이얼로그 핸들 (id, componentKey) */
  handle: OpenDialogResult;
  /** 현재 스택 정보 */
  stack: DialogStackInfo;
  /** 현재 다이얼로그를 닫음. (isOpen=false) */
  close: () => void;
  /** 애니메이션 종료 후 다이얼로그를 완전히 제거 */
  unmount: () => void;
  /** 전체 스택을 닫음 */
  closeAll: () => void;
  /** 전체 스택을 완전히 제거 */
  unmountAll: () => void;
  /**
   * 사용자 정의 상태 업데이트.
   * 객체 또는 이전 상태를 인자로 받는 함수형 업데이트를 지원합니다.
   */
  update: (updater: DialogStateUpdater<TProps>) => void;
  /**
   * 특정 필드 값을 안전하게 조회합니다.
   * state에 값이 없으면 fallback을 반환합니다.
   */
  getProp: <V>(key: PropertyKey, fallback: V) => V;
  /**
   * 현재 state를 주어진 기본 객체와 병합해 반환합니다.
   * state가 비어 있으면 기본 객체가 그대로 반환됩니다.
   */
  getProps: <T extends Record<string, unknown>>(base: T) => T;
  /** Promise 기반 컨트롤러에서 결과를 resolve */
  resolve?: (payload: DialogAsyncResolvePayload<unknown>) => void;
  /** Promise 기반 컨트롤러에서 Promise를 reject */
  reject?: (reason?: unknown) => void;
  /** 현재 컨트롤러 상태 */
  status: DialogStatus;
  /** 상태 조회 */
  getStatus: () => DialogStatus;
  /** 상태 설정 */
  setStatus: (status: DialogStatus) => void;
}

/**
 * 스토어 스냅샷 구조.
 */
export interface DialogStoreSnapshot {
  entries: DialogEntry[];
}

/**
 * 다이얼로그를 열 때 전달할 수 있는 옵션입니다.
 */
export type OpenDialogOptions = {
  /** 직접 ID를 지정하고 싶을 때 사용 */
  id?: DialogId;
  /** z-index를 강제로 지정할 때 사용 */
  zIndex?: number;
  /** React key를 명시적으로 제어하고 싶을 때 사용 */
  componentKey?: string;
};

/**
 * `open` 호출 결과로 반환되는 정보입니다.
 */
export interface OpenDialogResult {
  /** 생성된 다이얼로그 ID */
  id: DialogId;
  /** React key */
  componentKey: string;
}
