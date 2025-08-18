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
