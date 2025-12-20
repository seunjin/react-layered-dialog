import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';
import { FunctionSignature } from '@/components/docs/FunctionSignature';

const signature = `function createDialogApi<TRegistry extends Record<string, RegistryEntry>>(
  store: DialogStore,
  registry: TRegistry
): DialogApi<NormalizeRegistry<TRegistry>>`;

const dialogApiType = `type DialogApi<T> = {
  // 기본 스토어 메서드
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['update'];
} & {
  // 레지스트리 키별 생성된 메서드
  [K in keyof T]: DialogMethodFromDefinition<T[K]>;
}`;

const registryEntryTypes = `// 레지스트리 항목으로 사용 가능한 두 가지 형태

// 1. 객체 형태 (간단한 경우)
type ObjectEntry = {
  component: ComponentType<TProps>;
  mode?: 'sync' | 'async';  // 기본값: 'sync'
  displayName?: string;
};

// 2. defineDialog로 생성한 정의
type DefinitionEntry = DialogDefinition<TProps, TMode>;`;

const basicExample = `import { DialogStore, createDialogApi, defineDialog } from 'react-layered-dialog';
import { Alert, Confirm, Prompt } from './dialogs';

// 스토어 생성
const store = new DialogStore({ baseZIndex: 1000 });

// API 생성
export const dialog = createDialogApi(store, {
  // 객체 형태 - 동기 모드 (기본)
  alert: { component: Alert },
  
  // 객체 형태 - 비동기 모드
  confirm: { component: Confirm, mode: 'async' },
  
  // defineDialog 사용
  prompt: defineDialog(Prompt, { mode: 'async', displayName: 'PromptDialog' }),
});`;

const usageExample = `// 동기 다이얼로그 호출 (sync 모드)
const handle = dialog.alert({ title: '알림', message: '저장되었습니다' });
handle.close(); // 외부에서 제어 가능

// 비동기 다이얼로그 호출 (async 모드)
const result = await dialog.confirm({ 
  title: '삭제', 
  message: '정말 삭제하시겠습니까?' 
});

if (result.ok) {
  console.log('사용자가 확인함');
} else {
  console.log('사용자가 취소함');
}`;

const controllerFactoryExample = `// 컨트롤러 팩토리 패턴
// 함수를 전달하면 controller에 접근 가능
const result = await dialog.confirm((controller) => ({
  title: '삭제',
  message: '정말 삭제하시겠습니까?',
  onConfirm: () => {
    controller.setStatus('loading');
    // 비동기 작업 수행...
    controller.resolve?.({ ok: true, data: { id: 123 } });
  },
  onCancel: () => controller.resolve?.({ ok: false }),
}));`;

const autoIdExample = `// 자동 ID 생성: '{레지스트리키}-{순번}'
dialog.alert({ title: '첫 번째' }); // id: 'alert-0'
dialog.alert({ title: '두 번째' }); // id: 'alert-1'
dialog.confirm({ title: '확인' });  // id: 'confirm-0'

// 수동 ID 지정
dialog.alert({ title: '알림' }, { id: 'custom-id' });`;

export const ApiCreateDialogApiPage = () => (
  <DocArticle title="createDialogApi (API Reference)">
    <p className="lead">
      스토어와 레지스트리를 결합하여 타입 안전한 고수준 다이얼로그 API를 생성합니다.
      레지스트리 키마다 전용 메서드가 생성되며, 모드에 따라 sync/async가 자동 분기됩니다.
    </p>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="signature" title="Function Signature">
      <FunctionSignature
        signature={signature}
        description="DialogStore와 레지스트리 객체를 받아 타입 추론된 API 객체를 반환합니다."
        parameters={[
          { name: 'store', type: 'DialogStore', description: '다이얼로그 상태를 관리할 스토어 인스턴스' },
          { name: 'registry', type: 'TRegistry', description: '키-다이얼로그 매핑 객체' },
        ]}
        returnType="DialogApi<NormalizeRegistry<TRegistry>>"
        returnDescription="기본 스토어 메서드 + 레지스트리 키별 생성된 메서드를 포함한 API 객체"
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="return-type" title="Return Type">
      <CodeBlock language="ts" code={dialogApiType} />
      <DocCallout variant="tip" title="타입 자동 추론">
        레지스트리에 정의한 컴포넌트의 props 타입이 자동으로 추론됩니다.
        <InlineCode>dialog.alert()</InlineCode> 호출 시 IDE가 정확한 props를 제안합니다.
      </DocCallout>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="registry-entry" title="Registry Entry Types">
      <CodeBlock language="ts" code={registryEntryTypes} />
      <PropertyTable
        items={[
          { name: 'component', type: 'ComponentType<TProps>', description: '다이얼로그로 렌더링할 React 컴포넌트', required: true },
          { name: 'mode', type: "'sync' | 'async'", description: '동기/비동기 모드', defaultValue: "'sync'" },
          { name: 'displayName', type: 'string', description: 'React DevTools에 표시될 이름' },
        ]}
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="basic-example" title="Basic Example">
      <CodeBlock language="tsx" code={basicExample} />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="usage" title="사용 패턴">
      <Section as="h3" id="sync-async" title="동기 vs 비동기">
        <CodeBlock language="tsx" code={usageExample} />
        <PropertyTable
          items={[
            { name: "mode: 'sync'", type: 'DialogOpenResult', description: '즉시 핸들 반환. close(), update() 등으로 외부 제어' },
            { name: "mode: 'async'", type: 'Promise<DialogAsyncResult>', description: 'Promise 반환. resolve 호출 시 ok/data 포함하여 완료' },
          ]}
        />
      </Section>

      <Section as="h3" id="controller-factory" title="컨트롤러 팩토리 패턴">
        <CodeBlock language="tsx" code={controllerFactoryExample} />
        <DocCallout variant="info" title="언제 사용하나요?">
          비동기 다이얼로그에서 <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>에 접근하거나,
          다이얼로그 내부에서 <InlineCode>setStatus</InlineCode>로 로딩 상태를 관리할 때 사용합니다.
        </DocCallout>
      </Section>

      <Section as="h3" id="auto-id" title="자동 ID 생성">
        <CodeBlock language="ts" code={autoIdExample} />
        <p className="mt-2 text-sm text-muted-foreground">
          자동 생성되는 ID 형식: <InlineCode>{`{레지스트리키}-{순번}`}</InlineCode>.
          동일한 ID로 동시에 열 수 없으므로, 필요시 수동 ID를 지정하세요.
        </p>
      </Section>
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="behavior" title="동작 보장 사항">
      <PropertyTable
        items={[
          { name: '모드 자동 분기', type: 'auto', description: "sync → store.open(), async → store.openAsync() 자동 선택" },
          { name: '타입 안전성', type: 'TypeScript', description: '레지스트리 컴포넌트의 props가 호출부에 정확히 추론됨' },
          { name: '기본 메서드 노출', type: 'passthrough', description: 'open, close, update 등 스토어 메서드도 API에서 직접 사용 가능' },
          { name: 'ID 카운터 독립', type: 'per-key', description: '각 레지스트리 키마다 별도 순번 카운터 유지' },
        ]}
      />
    </Section>

    {/* ───────────────────────────────────────────────────────────────────── */}
    <Section as="h2" id="related" title="Related">
      <DocLinks
        links={[
          { to: '/api/dialog-store', label: 'API → DialogStore' },
          { to: '/api/define-dialog', label: 'API → defineDialog' },
          { to: '/api/types', label: 'API → Types' },
          { to: '/building-dialogs/defining', label: '구현 가이드 → 다이얼로그 타입 설계' },
        ]}
      />
    </Section>
  </DocArticle>
);
