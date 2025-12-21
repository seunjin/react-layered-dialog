/**
 * 특정 필드 값을 안전하게 조회합니다.
 * @param state 현재 다이얼로그의 상태 객체
 * @param key 조회할 필드 키
 * @param fallback 값이 없을 경우 반환할 기본값
 */
export function getProp<V>(state: Record<PropertyKey, unknown>, key: PropertyKey, fallback: V): V {
  if (state && Object.prototype.hasOwnProperty.call(state, key)) {
    return state[key] as V;
  }
  return fallback;
}

/**
 * 기본 객체와 현재 상태를 안전하게 병합합니다.
 * @param state 현재 다이얼로그의 상태 객체
 * @param base 병합의 기준이 되는 기본 객체
 */
export function getProps<T extends Record<PropertyKey, unknown>>(state: Record<PropertyKey, unknown>, base: T): T {
  if (!state) return base;
  return { ...base, ...state } as T;
}
