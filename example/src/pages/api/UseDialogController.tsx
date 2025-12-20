import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';
import { FunctionSignature } from '@/components/docs/FunctionSignature';

const signature = `function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>
>(): DialogControllerContextValue<TProps>`;

const controllerInterface = `interface DialogControllerContextValue<TProps = Record<string, unknown>> {
  // 식별 정보
  id: DialogId;
  handle: OpenDialogResult;
  
  // 상태
  isOpen: boolean;
  state: TProps;
  zIndex: number;
  status: DialogStatus;
  
  // 스택 정보
  stack: DialogStackInfo;
  
  // 제어 메서드
  close(): void;
  unmount(): void;
  closeAll(): void;
  unmountAll(): void;
  update(updater: DialogStateUpdater<TProps>): void;
  
  // 상태 조회/설정
  getProp<V>(key: PropertyKey, fallback: V): V;
  getProps<T>(base: T): T;
  getStatus(): DialogStatus;
  setStatus(status: DialogStatus): void;
  
  // 비동기 전용 (async 모드에서만 사용 가능)
  resolve?(payload: DialogAsyncResolvePayload): void;
  reject?(reason?: unknown): void;
}`;

const basicExample = `import { useDialogController } from 'react-layered-dialog';

interface AlertProps {
  title: string;
  message: string;
}

export function Alert({ title, message }: AlertProps) {
  // 제네릭으로 state 타입 지정
  const controller = useDialogController<AlertProps>();
  
  const handleClose = () => {
    controller.close();    // isOpen = false
    controller.unmount();  // DOM 제거
  };

  return (
    <div style={{ zIndex: controller.zIndex }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={handleClose}>확인</button>
    </div>
  );
}`;

const asyncExample = `import { useDialogController } from 'react-layered-dialog';

interface ConfirmProps {
  title: string;
  message: string;
}

export function Confirm({ title, message }: ConfirmProps) {
  const controller = useDialogController<ConfirmProps>();

  const handleConfirm = async () => {
    controller.setStatus('loading');
    
    try {
      await someAsyncOperation();
      controller.setStatus('done');
      controller.resolve?.({ ok: true, data: { confirmed: true } });
    } catch (error) {
      controller.setStatus('error');
      controller.reject?.(error);
    }
  };

  const handleCancel = () => {
    controller.resolve?.({ ok: false });
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
      {controller.status === 'loading' && <Spinner />}
      <button onClick={handleConfirm} disabled={controller.status === 'loading'}>
        확인
      </button>
      <button onClick={handleCancel}>취소</button>
    </div>
  );
}`;

const stackExample = `function Modal() {
  const controller = useDialogController();
  
  // 최상단 다이얼로그만 ESC 키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && controller.stack.topId === controller.id) {
        controller.close();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [controller.id, controller.stack.topId]);

  return (
    <div>
      <p>스택 위치: {controller.stack.index + 1} / {controller.stack.size}</p>
      {controller.stack.topId === controller.id && (
        <p>현재 최상단 다이얼로그입니다</p>
      )}
    </div>
  );
}`;

const stateAccessExample = `function EditDialog() {
  const controller = useDialogController<{ name: string; age: number }>();

  // 개별 필드 조회 (fallback 제공)
  const name = controller.getProp('name', '');
  const age = controller.getProp('age', 0);

  // 전체 상태를 기본값과 병합
  const defaults = { name: '', age: 0, email: '' };
  const state = controller.getProps(defaults);
  // { name: '사용자값', age: 사용자값, email: '' }

  // 상태 업데이트
  const handleUpdate = () => {
    controller.update({ name: '새 이름' });  // 부분 업데이트
    controller.update(prev => ({ age: prev.age + 1 }));  // 함수형 업데이트
  };

  return <div>...</div>;
}`;

export const ApiUseDialogControllerPage = () => (
  <DocArticle title="useDialogController (API Reference)">
    <p className="lead">
      다이얼로그 컴포넌트 내부에서 현재 다이얼로그의 컨트롤러에 접근하는 훅입니다.
      상태 조회, 닫기, 업데이트 등의 메서드를 제공합니다.
    </p>

    <DocCallout variant="warning" title="사용 위치">
      이 훅은 <InlineCode>DialogsRenderer</InlineCode> 내부에서 렌더링되는 다이얼로그 컴포넌트에서만 사용할 수 있습니다.
      외부에서 호출하면 에러가 발생합니다.
    </DocCallout>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <FunctionSignature
      id="signature"
      title="useDialogController()"
      signature={signature}
      description="현재 다이얼로그의 컨트롤러 컨텍스트를 반환합니다."
      returnType="DialogControllerContextValue<TProps>"
      returnDescription="다이얼로그 상태와 제어 메서드를 포함한 객체"
      usage={basicExample}
    />

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="return-type" title="Return Type">
      <CodeBlock language="ts" code={controllerInterface} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="properties" title="속성 상세">
      <Section as="h3" id="identification" title="식별 정보">
        <PropertyTable
          items={[
            { name: 'id', type: 'DialogId', description: '현재 다이얼로그의 고유 ID', required: true },
            { name: 'handle', type: 'OpenDialogResult', description: 'id와 componentKey를 포함한 핸들 객체', required: true },
          ]}
        />
      </Section>

      <Section as="h3" id="state-props" title="상태">
        <PropertyTable
          items={[
            { name: 'isOpen', type: 'boolean', description: '다이얼로그가 열려 있는지 여부. close() 호출 시 false', required: true },
            { name: 'state', type: 'TProps', description: '사용자 정의 상태. update()로 변경 가능', required: true },
            { name: 'zIndex', type: 'number', description: '현재 다이얼로그의 z-index 값', required: true },
            { name: 'status', type: 'DialogStatus', description: "'idle' | 'loading' | 'done' | 'error'", required: true },
          ]}
        />
      </Section>

      <Section as="h3" id="stack-info" title="스택 정보">
        <PropertyTable
          items={[
            { name: 'stack.topId', type: 'DialogId | null', description: '현재 열린 다이얼로그 중 최상단 ID' },
            { name: 'stack.size', type: 'number', description: '열린 다이얼로그의 총 개수' },
            { name: 'stack.index', type: 'number', description: '현재 다이얼로그의 스택 인덱스 (0부터 시작)' },
          ]}
        />
      </Section>

      <Section as="h3" id="control-methods" title="제어 메서드">
        <PropertyTable
          items={[
            { name: 'close()', type: '() => void', description: '현재 다이얼로그 닫기 (isOpen = false)', required: true },
            { name: 'unmount()', type: '() => void', description: '다이얼로그 DOM에서 완전 제거', required: true },
            { name: 'closeAll()', type: '() => void', description: '모든 다이얼로그 닫기', required: true },
            { name: 'unmountAll()', type: '() => void', description: '모든 다이얼로그 제거', required: true },
            { name: 'update(updater)', type: '(updater) => void', description: '상태 업데이트. 객체 또는 함수형', required: true },
          ]}
        />
      </Section>

      <Section as="h3" id="state-access-methods" title="상태 접근 메서드">
        <PropertyTable
          items={[
            { name: 'getProp(key, fallback)', type: '<V>(key, fallback) => V', description: '특정 필드 값 조회. 없으면 fallback 반환' },
            { name: 'getProps(base)', type: '<T>(base) => T', description: '현재 state와 기본 객체 병합' },
            { name: 'getStatus()', type: '() => DialogStatus', description: '현재 상태 조회' },
            { name: 'setStatus(status)', type: '(status) => void', description: '상태 설정' },
          ]}
        />
      </Section>

      <Section as="h3" id="async-methods" title="비동기 전용 메서드">
        <PropertyTable
          items={[
            { name: 'resolve(payload)', type: '(payload) => void', description: 'Promise resolve. { ok, data } 형태로 전달', required: false },
            { name: 'reject(reason)', type: '(reason?) => void', description: 'Promise reject', required: false },
          ]}
        />
        {/* <DocCallout variant="info" title="async 모드 전용">
          <InlineCode>resolve</InlineCode>와 <InlineCode>reject</InlineCode>는{' '}
          <InlineCode>mode: &apos;async&apos;</InlineCode>로 정의된 다이얼로그에서만 존재합니다.
          sync 모드에서는 <InlineCode>undefined</InlineCode>입니다.
        </DocCallout> */}
      </Section>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="basic-example" title="기본 사용법">
      <CodeBlock language="tsx" code={basicExample} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="async-example" title="비동기 다이얼로그 패턴">
      <CodeBlock language="tsx" code={asyncExample} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="stack-example" title="스택 정보 활용">
      <CodeBlock language="tsx" code={stackExample} />
      {/* <DocCallout variant="tip" title="최상단 감지">
        <InlineCode>stack.topId === id</InlineCode>를 비교하여 현재 다이얼로그가 최상단인지 확인하고,
        키보드 이벤트, 자동 포커스 등을 최상단에서만 처리할 수 있습니다.
      </DocCallout> */}
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="state-access" title="상태 접근 패턴">
      <CodeBlock language="tsx" code={stateAccessExample} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/api/types', label: 'API → Types (DialogControllerContextValue)' },
          { to: '/api/dialogs-renderer', label: 'API → DialogsRenderer' },
          { to: '/api/dialog-store', label: 'API → DialogStore' },
          { to: '/building-dialogs/components', label: '구현 가이드 → 컴포넌트 기본기' },
        ]}
      />
    </Section>
  </DocArticle>
);
