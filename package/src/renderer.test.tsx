import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { DialogStore } from './store';
import { DialogsRenderer, useDialogController } from './renderer';

const TestComponent = ({ title, message }: { title: string; message: string }) => {
    const { zIndex, close, unmount, getProps, status } = useDialogController<{ title: string; message: string }>();
    const props = getProps({ title, message });

    return (
        <div data-testid="dialog-root" style={{ zIndex }}>
            <h1 data-testid="title">{props.title}</h1>
            <p data-testid="message">{props.message}</p>
            <span data-testid="status">{status}</span>
            <button data-testid="close-btn" onClick={close}>Close</button>
            <button data-testid="unmount-btn" onClick={unmount}>Unmount</button>
        </div>
    );
};

describe('DialogsRenderer & useDialogController', () => {
    it('renders a dialog and updates its state', () => {
        const store = new DialogStore();
        render(<DialogsRenderer store={store} />);

        act(() => {
            store.open(() => <TestComponent title="Initial Title" message="Initial Message" />);
        });

        expect(screen.getByTestId('title').textContent).toBe('Initial Title');
        expect(screen.getByTestId('message').textContent).toBe('Initial Message');

        const entry = store.getSnapshot().entries[0];
        act(() => {
            store.update(entry.id, { title: 'Updated Title' });
        });

        expect(screen.getByTestId('title').textContent).toBe('Updated Title');
        expect(screen.getByTestId('message').textContent).toBe('Initial Message'); // message should remain
    });

    it('handles close and unmount sequence', () => {
        const store = new DialogStore();
        render(<DialogsRenderer store={store} />);

        act(() => {
            store.open(() => <TestComponent title="T" message="M" />);
        });

        const closeBtn = screen.getByTestId('close-btn');
        const unmountBtn = screen.getByTestId('unmount-btn');

        // Close
        act(() => {
            closeBtn.click();
        });
        expect(store.getSnapshot().entries[0].isOpen).toBe(false);
        expect(screen.queryByTestId('dialog-root')).not.toBeNull(); // Still in DOM

        // Unmount
        act(() => {
            unmountBtn.click();
        });
        expect(store.getSnapshot().entries).toHaveLength(0);
        expect(screen.queryByTestId('dialog-root')).toBeNull(); // Removed from DOM
    });

    it('provides correct stack info and z-index', () => {
        const store = new DialogStore();
        render(<DialogsRenderer store={store} />);

        act(() => {
            store.open(() => <TestComponent title="D1" message="M1" />);
            store.open(() => <TestComponent title="D2" message="M2" />);
        });

        const dialogs = screen.getAllByTestId('dialog-root');
        expect(dialogs[0].style.zIndex).toBe('1000');
        expect(dialogs[1].style.zIndex).toBe('1001');
    });

    it('updates status and reflects in UI', () => {
        const store = new DialogStore();
        render(<DialogsRenderer store={store} />);

        act(() => {
            store.open(() => <TestComponent title="T" message="M" />);
        });

        expect(screen.getByTestId('status').textContent).toBe('idle');

        const entry = store.getSnapshot().entries[0];
        act(() => {
            store.setStatus(entry.id, 'loading');
        });

        expect(screen.getByTestId('status').textContent).toBe('loading');
    });

    it('throws error when useDialogController is used outside of DialogsRenderer', () => {
        // suppress console.error for expected error
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const WrongComponent = () => {
            useDialogController();
            return null;
        };

        expect(() => {
            render(<WrongComponent />);
        }).toThrow('useDialogController must be used within a dialog controller context.');

        spy.mockRestore();
    });
});
