import type React from 'react';

// --- 핵심 타입 ---

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