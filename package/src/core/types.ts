import type React from 'react';

/**
 * 모든 레이어 컴포넌트의 Public API 역할을 하는 공통 Props 명세입니다.
 * 이 인터페이스는 `DialogManager`가 레이어를 관리하는 데 필요한 최소한의 상태와,
 * 레이어의 동작을 선언적으로 설정하는 옵션을 포함합니다.
 * 이 Props에 선언된 동작 옵션들은 `useLayerBehavior` 훅을 통해 실제 동작으로 구현됩니다.
 */
export interface BaseLayerProps {
  /**
   * 레이어의 쌓임 순서(z-index)입니다.
   * 일반적으로 자동 관리에 맡기는 것을 권장합니다.
   * 다른 라이브러리와의 z-index 충돌 등 특수한 경우에만 직접 지정하세요.
   * 지정하지 않으면 `baseZIndex`(기본값 1000)부터 시작하는 값이 자동으로 할당됩니다.
   */
  zIndex?: number;
  /**
   * 레이어 뒤에 깔리는 어두운 배경(dim)을 표시할지 여부입니다.
   * @default true
   */
  dimmed?: boolean;
  /**
   * 오버레이(배경) 클릭 시 레이어를 닫을지 여부입니다.
   * `useLayerBehavior` 훅의 `closeOnOutsideClick` 옵션을 통해 구현됩니다.
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Escape 키를 눌렀을 때 레이어를 닫을지 여부입니다.
   * `useLayerBehavior` 훅의 `closeOnEscape` 옵션을 통해 구현됩니다.
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * 레이어가 열렸을 때 배경 스크롤을 막을지 여부입니다. (향후 구현 예정)
   * @default true
   */
  scrollLock?: boolean;
}

/**
 * 다이얼로그 상태 정의 시 공통으로 확장하는 기본 타입입니다.
 * `id`와 `isOpen`은 매니저에서 자동으로 채워지므로 선택적으로만 선언합니다.
 */
export interface BaseStateMeta {
  /**
   * 매니저가 부여하는 다이얼로그 고유 ID입니다.
   */
  id?: string;
  /**
   * 현재 다이얼로그가 열린 상태인지 여부입니다.
   */
  isOpen?: boolean;
}

/**
 * 다이얼로그 상태 정의 시 공통으로 확장하는 기본 타입입니다.
 * `BaseLayerProps`에 더해 `id`, `isOpen` 메타 필드를 포함합니다.
 */
export type BaseState = BaseLayerProps & BaseStateMeta;

/**
 * 다이얼로그 상태 업데이트 시 사용할 수 있는 부분 상태 타입입니다.
 * 각 다이얼로그 타입별로 고유한 필드만 선택적으로 포함합니다.
 */
export type DialogPatch<T extends { type: string }> = Partial<
  Omit<DialogState<T>, 'id' | 'type' | 'isOpen'>
>;

type RequiredMeta = Required<Pick<BaseStateMeta, 'id' | 'isOpen'>>;

export type DialogState<T> = T & BaseLayerProps & RequiredMeta;

export type Listener = () => void;

/**
 * "상관된 유니온(Correlated Union)" 타입.
 * Component와 state 간의 타입 관계를 보장합니다.
 */
export type DialogInstance<T extends { type: string }> = {
  [K in T['type']]: {
    Component: React.ComponentType<DialogState<Extract<T, { type: K }>>>;
    state: DialogState<Extract<T, { type: K }>>;
  };
}[T['type']];

/**
 * `createDialogManager`에 전달할 수 있는 설정 객체입니다.
 */
export interface DialogsConfig {
  /**
   * 다이얼로그의 z-index가 시작될 기본 값입니다.
   * @default 1000
   */
  baseZIndex?: number;
}

export type DialogHandle<K extends string = string> = {
  id: string;
  type: K;
};
