import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createDialogManager, BaseDialogState } from './index';
import type React from 'react';

// --- Test Setup ---

const TestComponent: React.FC<object> = () => null;
const AnotherTestComponent: React.FC<object> = () => null;

// TestState now extends BaseDialogState and inherits id and isOpen
interface TestState extends BaseDialogState {
  type: 'modal' | 'toast';
  message: string;
  useOverlay?: boolean;
}

// --- Tests ---

describe('createDialogManager (DX-focused API)', () => {
  let manager: ReturnType<typeof createDialogManager<TestState>>['manager'];
  let useDialogs: ReturnType<typeof createDialogManager<TestState>>['useDialogs'];

  beforeEach(() => {
    const toolkit = createDialogManager<TestState>({
      defaults: {
        modal: { useOverlay: true },
        toast: { useOverlay: false, message: 'Default' },
      },
    });
    manager = toolkit.manager;
    useDialogs = toolkit.useDialogs;
  });

  it('should open a dialog with separate component and state', () => {
    const { result } = renderHook(() => useDialogs());
    act(() => {
      manager.open(TestComponent, { type: 'modal', message: 'Hello' });
    });

    expect(result.current).toHaveLength(1);
    const dialogInstance = result.current[0];
    expect(dialogInstance.Component).toBe(TestComponent);
    expect(dialogInstance.state.id).toBeDefined();
    expect(dialogInstance.state.isOpen).toBe(true);
    expect(dialogInstance.state.type).toBe('modal');
    expect(dialogInstance.state.message).toBe('Hello');
  });

  it('should apply defaults to the state', () => {
    const { result } = renderHook(() => useDialogs());
    act(() => {
      manager.open(AnotherTestComponent, { type: 'toast' });
    });

    expect(result.current).toHaveLength(1);
    const dialogInstance = result.current[0];
    expect(dialogInstance.Component).toBe(AnotherTestComponent);
    expect(dialogInstance.state.useOverlay).toBe(false);
    expect(dialogInstance.state.message).toBe('Default');
  });

  it('should close a dialog', () => {
    const { result } = renderHook(() => useDialogs());
    let dialogId = '';
    act(() => {
      dialogId = manager.open(TestComponent, { type: 'modal', message: 'First' });
    });
    expect(result.current).toHaveLength(1);

    act(() => {
      manager.close(dialogId);
    });
    expect(result.current).toHaveLength(0);
  });
});
