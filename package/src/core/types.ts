import type React from 'react';

// --- 핵심 타입 ---

/**
 * 모든 다이얼로그가 공통적으로 가질 수 있는 선택적 상태들.
 * 사용자는 자신의 상태 인터페이스에서 이 타입을 확장(extend)하여 사용할 수 있습니다.
 */
export interface BaseState {
  /**
   * 특정 다이얼로그의 z-index를 직접 설정합니다.
   * 설정하지 않으면 라이브러리가 자동으로 관리합니다.
   */
  zIndex?: number;

  /**
   * 다이얼로그 뒤의 오버레이(배경) 설정.
   * `true`일 경우 기본값 사용, `false`일 경우 미사용.
   * @default true
   */
  overlay?: {
    /**
     * 오버레이 클릭 시 다이얼로그를 닫을지 여부.
     * @default true
     */
    closeOnClick?: boolean;
    /**
     * 오버레이의 투명도. 0 (투명) ~ 1 (불투명).
     * @default 0.5
     */
    opacity?: number;
    /**
     * 오버레이에 적용할 추가적인 CSS 클래스.
     */
    className?: string;
  } | boolean;

  /**
   * 다이얼로그를 Esc 키나 오버레이 클릭으로 닫을 수 있는지 여부.
   * @default true
   */
  dismissable?: boolean;

  /**
   * 다이얼로그가 열렸을 때 배경 스크롤을 잠글지 여부.
   * @default true
   */
  scrollLock?: boolean;
}

/**
 * 다이얼로그 인스턴스의 내부 전체 상태.
 * 라이브러리 관리 속성(id, isOpen)과 사용자가 정의한 상태 T를 결합합니다.
 * @template T 사용자가 정의한 다이얼로그 상태 타입
 */
export type DialogState<T> = T & {
  id: string;
  isOpen: boolean;
};

/**
 * 관리자 상태에 있는 다이얼로그 인스턴스의 내부 표현.
 * 다이얼로그 컴포넌트와 전체 상태 객체를 보유합니다.
 * @template T 사용자가 정의한 다이얼로그 상태 타입
 */
export interface DialogInstance<T> {
  Component: React.ComponentType<DialogState<T>>; // 컴포넌트는 전체 내부 상태를 props로 받습니다.
  state: DialogState<T>; // 전체 내부 상태 객체
}

export type Listener = () => void;

/**
 * 상태 타입의 유니온을 기반으로 구체적인 DialogInstance 타입의 유니온을 생성합니다.
 * 예: SomeDialogInstance<AlertState | ConfirmState>는
 * DialogInstance<AlertState> | DialogInstance<ConfirmState>가 됩니다.
 * 이를 통해 타입스크립트가 컴포넌트와 상태 간의 연결을 추적할 수 있습니다.
 */
export type SomeDialogInstance<T extends { type: string }> = {
  [K in T['type']]: DialogInstance<Extract<T, { type: K }>>;
}[T['type']];

/**
 * 다이얼로그 시스템의 설정을 위한 타입
 */
export interface DialogsConfig {
  /**
   * 다이얼로그들의 z-index 시작 값.
   * 다이얼로그가 열릴 때마다 이 값부터 1씩 증가합니다.
   * @default 1000
   */
  baseZIndex?: number;
}
