// index.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createDialogManager } from './index';
import type React from 'react';

// --- 테스트 설정 ---

const TestComponent: React.FC<object> = () => null;

// 테스트 상태 정의
interface TestState {
  type: 'modal' | 'toast';
  message: string;
  useOverlay?: boolean;
}

// --- 테스트 ---

describe('createDialogManager (개발자 경험(DX) 중심 API)', () => {
  let manager: ReturnType<typeof createDialogManager<TestState>>['manager'];
  let useDialogsState: ReturnType<
    typeof createDialogManager<TestState>
  >['useDialogsState'];

  beforeEach(() => {
    // defaults 기능이 제거되었으므로, 인자 없이 호출합니다.
    const toolkit = createDialogManager<TestState>();
    manager = toolkit.manager;
    useDialogsState = toolkit.useDialogsState;
  });

  it('컴포넌트와 상태를 분리하여 다이얼로그를 열어야 한다', () => {
    const { result } = renderHook(() => useDialogsState());
    act(() => {
      manager.openDialog(TestComponent, { type: 'modal', message: 'Hello' });
    });

    expect(result.current).toHaveLength(1);
    const dialogInstance = result.current[0];
    expect(dialogInstance.Component).toBe(TestComponent);
    expect(dialogInstance.state.id).toBeDefined();
    expect(dialogInstance.state.isOpen).toBe(true);
    expect(dialogInstance.state.type).toBe('modal');
    expect(dialogInstance.state.message).toBe('Hello');
  });

  // defaults 기능이 제거되었으므로, 이와 관련된 테스트는 삭제합니다.
  // it('상태에 기본값을 적용해야 한다', ...);

  it('다이얼로그를 닫아야 한다', () => {
    const { result } = renderHook(() => useDialogsState());
    let dialogId = '';
    act(() => {
      dialogId = manager.openDialog(TestComponent, {
        type: 'modal',
        message: 'First',
      });
    });
    expect(result.current).toHaveLength(1);

    act(() => {
      manager.closeDialog(dialogId);
    });
    expect(result.current).toHaveLength(0);
  });
});
