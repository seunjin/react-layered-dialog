import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';
import { FunctionSignature } from '@/components/docs/FunctionSignature';

// ─────────────────────────────────────────────────────────────────────────────
// Constructor
// ─────────────────────────────────────────────────────────────────────────────

const constructorCode = `const store = new DialogStore({
  baseZIndex: 1000, // 기본값
});`;

// ─────────────────────────────────────────────────────────────────────────────
// Class Signature
// ─────────────────────────────────────────────────────────────────────────────

const classSignature = `class DialogStore {
  constructor(options?: DialogStoreOptions);

  // Stack Management
  open<TProps>(renderer: DialogRenderFn<TProps>, options?: OpenDialogOptions): DialogOpenResult<TProps>;
  openAsync<TProps, TData>(renderer: DialogRenderFn<TProps>, options?: OpenDialogOptions): Promise<DialogAsyncResult<TProps, TData>>;
  close(id?: DialogId): void;
  unmount(id?: DialogId): void;
  closeAll(): void;
  unmountAll(): void;

  // State Management
  update<TProps>(id: DialogId, updater: DialogStateUpdater<TProps>): void;
  setStatus(id: DialogId, status: DialogStatus): void;
  getStatus(id: DialogId): DialogStatus;

  // Subscription
  subscribe(listener: DialogListener): () => void;
  getSnapshot(): DialogStoreSnapshot;
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Method Examples
// ─────────────────────────────────────────────────────────────────────────────

const openExample = `// 동기 방식 - 즉시 핸들 반환
const handle = store.open<{ message: string }>(
  (controller) => <Alert message={controller.state.message} onClose={controller.close} />,
  { id: 'my-alert' }
);

// 핸들을 통해 외부에서 제어
handle.update({ message: '새로운 메시지' });
handle.close();  // isOpen = false
handle.unmount(); // DOM에서 제거`;

const openAsyncExample = `// 비동기 방식 - Promise 반환
const result = await store.openAsync<{ title: string }, { confirmed: boolean }>(
  (controller) => (
    <Confirm 
      title={controller.state.title}
      onConfirm={() => controller.resolve?.({ ok: true, data: { confirmed: true } })}
      onCancel={() => controller.resolve?.({ ok: false })}
    />
  )
);

if (result.ok) {
  console.log('사용자가 확인함:', result.data);
} else {
  console.log('사용자가 취소함');
}`;

const closeExample = `// 특정 다이얼로그 닫기
store.close('my-dialog');

// 마지막 다이얼로그 닫기 (id 생략)
store.close();`;

const unmountExample = `// 특정 다이얼로그 완전 제거
store.unmount('my-dialog');

// 마지막 다이얼로그 제거 (id 생략)
store.unmount();`;

const updateExample = `// 객체로 업데이트 (병합됨)
store.update('my-dialog', { count: 5, message: '업데이트됨' });

// 함수형 업데이트
store.update('my-dialog', (prev) => ({ 
  count: prev.count + 1 
}));`;

const statusExample = `// 상태 설정
store.setStatus('my-dialog', 'loading');

// 상태 조회
const status = store.getStatus('my-dialog'); // 'loading'`;

const subscribeExample = `// 상태 변경 구독
const unsubscribe = store.subscribe(() => {
  console.log('다이얼로그 상태 변경됨');
  const snapshot = store.getSnapshot();
  console.log('현재 열린 다이얼로그 수:', snapshot.entries.length);
});

// 구독 해제
unsubscribe();`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const ApiDialogStorePage = () => (
  <DocArticle title="DialogStore (API Reference)">
    <p className="lead">
      다이얼로그 스택과 메타 정보(z-index, 상태)를 관리하는 코어 클래스입니다.
      렌더링은 앱의 책임이며, 이 스토어는 스택 조작과 구독만 담당합니다.
    </p>

    <DocCallout variant="info" title="분리된 관심사">
      DialogStore는 상태 관리만 담당합니다. React 렌더링은 <InlineCode>DialogsRenderer</InlineCode>가,
      컨텍스트 접근은 <InlineCode>useDialogController</InlineCode>가 담당합니다.
    </DocCallout>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="constructor" title="Constructor">
      <CodeBlock language="ts" code={constructorCode} />
      <PropertyTable
        items={[
          {
            name: 'baseZIndex',
            type: 'number',
            description: '다이얼로그 z-index 시작값. 이후 열리는 다이얼로그는 자동으로 1씩 증가',
            defaultValue: '1000'
          },
        ]}
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="signature" title="Class Signature">
      <CodeBlock language="ts" code={classSignature} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="stack-management" title="Stack Management">
      <p className="text-sm text-muted-foreground mb-4">
        다이얼로그 스택을 조작하는 메서드들입니다.
      </p>

      <FunctionSignature
        id="open"
        title="open()"
        signature={`open<TProps>(
  renderer: DialogRenderFn<TProps>,
  options?: OpenDialogOptions
): DialogOpenResult<TProps>`}
        description="새 다이얼로그를 스택에 추가하고 제어 핸들을 즉시 반환합니다."
        parameters={[
          { name: 'renderer', type: 'DialogRenderFn<TProps>', description: '컨트롤러를 받아 ReactNode를 반환하는 렌더링 함수' },
          { name: 'options', type: 'OpenDialogOptions', description: 'ID, z-index, componentKey 등 옵션', optional: true },
        ]}
        returnType="DialogOpenResult<TProps>"
        returnDescription="close, unmount, update 등의 메서드를 포함한 제어 핸들"
        usage={openExample}
      />

      <FunctionSignature
        id="open-async"
        title="openAsync()"
        signature={`openAsync<TProps, TData = unknown>(
  renderer: DialogRenderFn<TProps>,
  options?: OpenDialogOptions
): Promise<DialogAsyncResult<TProps, TData>>`}
        description="Promise 기반 다이얼로그를 열고 사용자 응답을 await합니다."
        parameters={[
          { name: 'renderer', type: 'DialogRenderFn<TProps>', description: '렌더링 함수. controller.resolve()로 Promise를 resolve' },
          { name: 'options', type: 'OpenDialogOptions', description: '동기 open과 동일한 옵션', optional: true },
        ]}
        returnType="Promise<DialogAsyncResult<TProps, TData>>"
        returnDescription="ok, data를 포함한 결과 객체. 사용자가 resolve 호출 시 Promise가 완료됨"
        usage={openAsyncExample}
      />

      <FunctionSignature
        id="close"
        title="close()"
        signature="close(id?: DialogId): void"
        description="다이얼로그를 닫습니다 (isOpen = false). DOM에서 제거하지 않아 퇴장 애니메이션 구현이 가능합니다."
        parameters={[
          { name: 'id', type: 'DialogId', description: '닫을 다이얼로그 ID. 생략 시 마지막 다이얼로그', optional: true },
        ]}
        usage={closeExample}
      />

      <FunctionSignature
        id="unmount"
        title="unmount()"
        signature="unmount(id?: DialogId): void"
        description="다이얼로그를 스택에서 완전히 제거합니다. 퇴장 애니메이션 완료 후 호출하세요."
        parameters={[
          { name: 'id', type: 'DialogId', description: '제거할 다이얼로그 ID. 생략 시 마지막 다이얼로그', optional: true },
        ]}
        usage={unmountExample}
      />

      <FunctionSignature
        id="close-all"
        title="closeAll()"
        signature="closeAll(): void"
        description="모든 다이얼로그를 닫습니다 (isOpen = false). DOM은 유지됩니다."
      />

      <FunctionSignature
        id="unmount-all"
        title="unmountAll()"
        signature="unmountAll(): void"
        description="모든 다이얼로그를 스택에서 제거하고 z-index 카운터를 baseZIndex로 초기화합니다."
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="state-management" title="State Management">
      <p className="text-sm text-muted-foreground mb-4">
        다이얼로그 상태를 조작하는 메서드들입니다.
      </p>

      <FunctionSignature
        id="update"
        title="update()"
        signature={`update<TProps>(
  id: DialogId,
  updater: DialogStateUpdater<TProps>
): void`}
        description="다이얼로그의 사용자 정의 상태를 업데이트합니다. 객체 또는 함수형 업데이트를 지원합니다."
        parameters={[
          { name: 'id', type: 'DialogId', description: '업데이트할 다이얼로그 ID' },
          { name: 'updater', type: 'DialogStateUpdater<TProps>', description: '새 상태 객체 또는 (prev) => newState 함수' },
        ]}
        usage={updateExample}
      />

      <FunctionSignature
        id="set-status"
        title="setStatus()"
        signature="setStatus(id: DialogId, status: DialogStatus): void"
        description="다이얼로그의 상태(idle/loading/done/error)를 설정합니다."
        parameters={[
          { name: 'id', type: 'DialogId', description: '대상 다이얼로그 ID' },
          { name: 'status', type: 'DialogStatus', description: "'idle' | 'loading' | 'done' | 'error'" },
        ]}
        usage={statusExample}
      />

      <FunctionSignature
        id="get-status"
        title="getStatus()"
        signature="getStatus(id: DialogId): DialogStatus"
        description="다이얼로그의 현재 상태를 조회합니다."
        parameters={[
          { name: 'id', type: 'DialogId', description: '조회할 다이얼로그 ID' },
        ]}
        returnType="DialogStatus"
        returnDescription="현재 상태. 다이얼로그가 없으면 'idle' 반환"
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="subscription" title="Subscription">
      <p className="text-sm text-muted-foreground mb-4">
        상태 변경을 구독하는 메서드들입니다. <InlineCode>useSyncExternalStore</InlineCode>와 호환됩니다.
      </p>

      <FunctionSignature
        id="subscribe"
        title="subscribe()"
        signature="subscribe(listener: DialogListener): () => void"
        description="스토어 상태 변경을 구독합니다. 반환된 함수로 구독을 해제합니다."
        parameters={[
          { name: 'listener', type: 'DialogListener', description: '상태 변경 시 호출될 콜백 함수' },
        ]}
        returnType="() => void"
        returnDescription="구독 해제 함수"
        usage={subscribeExample}
      />

      <FunctionSignature
        id="get-snapshot"
        title="getSnapshot()"
        signature="getSnapshot(): DialogStoreSnapshot"
        description="현재 스택의 스냅샷을 반환합니다. 불변 객체로 참조 동등성 비교가 가능합니다."
        returnType="DialogStoreSnapshot"
        returnDescription="entries 배열을 포함한 스냅샷 객체"
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="behavior" title="동작 보장 사항">
      <ul className="space-y-4 text-base">
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>z-index 자동 증가:</strong> <InlineCode>baseZIndex</InlineCode>부터 시작하여 <InlineCode>open()</InlineCode> 호출 시마다 1씩 자동 증가합니다. 커스텀 z-index를 수동으로 지정할 경우 내부 카운터도 활성화된 최대값에 맞춰 조정됩니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>z-index 리셋:</strong> 스택이 완전히 비워지거나 <InlineCode>unmountAll()</InlineCode>이 호출될 경우, z-index 카운터는 다시 <InlineCode>baseZIndex</InlineCode>로 초기화됩니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>ID 중복 방지:</strong> 이미 스택에 존재하는 ID로 <InlineCode>open()</InlineCode>을 시도할 경우, 상태 충돌 데이터 보존을 위해 에러를 발생시켜 안전한 스택 관리를 보장합니다.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-muted-foreground font-mono mt-1 shrink-0">·</span>
          <span>
            <strong>불변 스냅샷:</strong> <InlineCode>getSnapshot()</InlineCode>은 상태 변경 시마다 새로운 객체 참조를 반환하여, React의 <InlineCode>useSyncExternalStore</InlineCode>와 같은 상태 구독 메커니즘에서 효율적인 비교와 리렌더링을 가능하게 합니다.
          </span>
        </li>
      </ul>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/api/types', label: 'API → Types' },
          { to: '/api/dialogs-renderer', label: 'API → DialogsRenderer' },
          { to: '/api/use-dialog-controller', label: 'API → useDialogController' },
          { to: '/building-dialogs/sync-patterns', label: '구현 가이드 → 동기 패턴' },
          { to: '/building-dialogs/async-patterns', label: '구현 가이드 → 비동기 패턴' },
        ]}
      />
    </Section>
  </DocArticle>
);
