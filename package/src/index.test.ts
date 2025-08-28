// index.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDialogManager, createUseDialogs } from './index';
import type React from 'react';
import type { DialogState, BaseState } from './core/types';

// --- 테스트 환경 설정 ---

// 1. 테스트용 다이오드 컴포넌트의 Props 타입 정의
type TestAlertProps = DialogState<AlertState>;
type TestConfirmProps = DialogState<ConfirmState>;

// 2. 테스트용 다이얼로그 컴포넌트 (명시적 Props 타입 사용)
const TestAlertComponent: React.FC<TestAlertProps> = () => null;
const TestConfirmComponent: React.FC<TestConfirmProps> = () => null;

// 3. 테스트용 다이얼로그 상태 타입 정의 (BaseState 확장)
interface AlertState extends BaseState {
  type: 'alert';
  message: string;
}
interface ConfirmState extends BaseState {
  type: 'confirm';
  question: string;
}
type TestDialogState = AlertState | ConfirmState;

// --- 테스트 시작 ---

describe('DialogManager (코어 로직) - 단위 테스트', () => {
  // 각 테스트 전에 manager를 새로 생성하여 테스트 간 독립성 보장
  let manager: ReturnType<typeof createDialogManager<TestDialogState>>['manager'];

  beforeEach(() => {
    const toolkit = createDialogManager<TestDialogState>({ baseZIndex: 2000 });
    manager = toolkit.manager;
  });

  it('openDialog를 호출하면 다이얼로그가 목록에 추가되어야 합니다.', () => {
    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '테스트 메시지' });
    });

    const dialogs = manager.getSnapshot();
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].Component).toBe(TestAlertComponent);
    expect(dialogs[0].state.type).toBe('alert');
    // 타입 단언을 사용하여 'message' 속성에 안전하게 접근합니다.
    expect((dialogs[0].state as AlertState).message).toBe('테스트 메시지');
    expect(dialogs[0].state.isOpen).toBe(true);
    expect(dialogs[0].state.id).toBeDefined();
  });

  it('closeDialog(id)를 호출하면 특정 다이얼로그가 제거되어야 합니다.', () => {
    let idToClose = '';
    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '첫 번째' });
      idToClose = manager.openDialog(TestConfirmComponent, { type: 'confirm', question: '두 번째' });
    });

    expect(manager.getSnapshot()).toHaveLength(2);

    act(() => {
      manager.closeDialog(idToClose);
    });

    const dialogs = manager.getSnapshot();
    expect(dialogs).toHaveLength(1);
    // 타입 단언을 사용하여 'message' 속성에 안전하게 접근합니다.
    expect((dialogs[0].state as AlertState).message).toBe('첫 번째');
  });

  it('closeDialog()를 호출하면 마지막 다이얼로그가 제거되어야 합니다 (스택 동작).', () => {
    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '첫 번째' });
      manager.openDialog(TestConfirmComponent, { type: 'confirm', question: '두 번째' });
    });

    expect(manager.getSnapshot()).toHaveLength(2);

    act(() => {
      manager.closeDialog(); // ID 없이 호출
    });

    const dialogs = manager.getSnapshot();
    expect(dialogs).toHaveLength(1);
    // 타입 단언을 사용하여 'message' 속성에 안전하게 접근합니다.
    expect((dialogs[0].state as AlertState).message).toBe('첫 번째');
  });

  it('closeAllDialogs를 호출하면 모든 다이얼로그가 제거되어야 합니다.', () => {
    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '첫 번째' });
      manager.openDialog(TestConfirmComponent, { type: 'confirm', question: '두 번째' });
    });

    expect(manager.getSnapshot()).toHaveLength(2);

    act(() => {
      manager.closeAllDialogs();
    });

    expect(manager.getSnapshot()).toHaveLength(0);
  });

  it('다이얼로그를 여러 개 열면 z-index가 순차적으로 증가해야 합니다.', () => {
    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '첫 번째' });
      manager.openDialog(TestConfirmComponent, { type: 'confirm', question: '두 번째' });
    });

    const dialogs = manager.getSnapshot();
    expect(dialogs[0].state.zIndex).toBe(2000); // baseZIndex
    expect(dialogs[1].state.zIndex).toBe(2001); // baseZIndex + 1
  });

  it('중복된 ID로 다이얼로그를 열면 경고 메시지를 출력해야 합니다.', () => {
    // console.warn을 모킹(mocking)하여 실제 콘솔에 출력되지 않게 하고, 호출 여부를 감시
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    act(() => {
      manager.openDialog(TestAlertComponent, { type: 'alert', message: '첫 번째', id: 'duplicate-id' });
      manager.openDialog(TestConfirmComponent, { type: 'confirm', question: '두 번째', id: 'duplicate-id' });
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[react-layered-dialog] Duplicate ID detected: "duplicate-id"'));

    // 테스트가 끝난 후 모킹을 원래대로 복원
    warnSpy.mockRestore();
  });
});


describe('useDialogs 훅 (React 연동) - 통합 테스트', () => {
  // useDialogs 훅을 생성하기 위한 설정
  let manager: ReturnType<typeof createDialogManager<TestDialogState>>['manager'];
  let useDialogs: ReturnType<typeof createUseDialogs<TestDialogState>>;

  beforeEach(() => {
    // 각 테스트 전에 manager와 useDialogs 훅을 새로 생성하여 상태를 초기화합니다.
    const toolkit = createDialogManager<TestDialogState>();
    manager = toolkit.manager;
    useDialogs = createUseDialogs(manager, {
      alert: TestAlertComponent,
      confirm: TestConfirmComponent,
    });
  });

  it('openDialog 호출 시 dialogs 상태가 올바르게 업데이트되어야 합니다.', () => {
    const { result } = renderHook(() => useDialogs());

    expect(result.current.dialogs).toHaveLength(0);

    act(() => {
      result.current.openDialog('alert', { message: '훅 테스트' });
    });

    const { dialogs } = result.current;
    expect(dialogs).toHaveLength(1);
    expect(dialogs[0].state.type).toBe('alert');
    // 타입 단언을 사용하여 'message' 속성에 안전하게 접근합니다.
    expect((dialogs[0].state as AlertState).message).toBe('훅 테스트');
  });

  it('closeDialog 호출 시 dialogs 상태가 올바르게 업데이트되어야 합니다.', () => {
    const { result } = renderHook(() => useDialogs());
    let idToClose = '';

    act(() => {
      result.current.openDialog('alert', { message: '첫 번째' });
      idToClose = result.current.openDialog('confirm', { question: '두 번째' });
    });

    expect(result.current.dialogs).toHaveLength(2);

    act(() => {
      result.current.closeDialog(idToClose);
    });

    expect(result.current.dialogs).toHaveLength(1);
    // 타입 단언을 사용하여 'message' 속성에 안전하게 접근합니다.
    expect((result.current.dialogs[0].state as AlertState).message).toBe('첫 번째');
  });
});
