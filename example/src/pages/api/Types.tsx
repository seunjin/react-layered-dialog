import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';

// ─────────────────────────────────────────────────────────────────────────────
// Core Types
// ─────────────────────────────────────────────────────────────────────────────

const dialogIdType = `/** 다이얼로그 고유 식별자 타입 */
export type DialogId = string;`;

const dialogStatusType = `/** 다이얼로그 상태: idle → loading → done/error */
export type DialogStatus = 'idle' | 'loading' | 'done' | 'error';`;

const dialogListenerType = `/** 스토어 상태 변경 시 호출되는 콜백 */
export type DialogListener = () => void;`;

const dialogRenderFnType = `/** 다이얼로그 렌더링 함수. 컨트롤러를 받아 ReactNode 반환 */
export type DialogRenderFn<TProps = Record<string, unknown>> = 
  (controller: DialogControllerContextValue<TProps>) => ReactNode;`;

// ─────────────────────────────────────────────────────────────────────────────
// Entry Types
// ─────────────────────────────────────────────────────────────────────────────

const dialogEntryType = `export interface DialogEntry {
  id: DialogId;
  renderer: DialogRenderFn;
  componentKey: string;
  isOpen: boolean;
  zIndex: number;
  state: Record<string, unknown>;
  asyncHandlers?: DialogAsyncEntryHandlers;
  meta: DialogEntryMeta;
}`;

const dialogEntryMetaType = `export interface DialogEntryMeta {
  status: DialogStatus;
}`;

const dialogStoreSnapshotType = `export interface DialogStoreSnapshot {
  entries: DialogEntry[];
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Controller Types
// ─────────────────────────────────────────────────────────────────────────────

const dialogControllerType = `export interface DialogControllerContextValue<TProps = Record<string, unknown>> {
  id: DialogId;
  isOpen: boolean;
  state: TProps;
  zIndex: number;
  handle: OpenDialogResult;
  stack: DialogStackInfo;
  close: () => void;
  unmount: () => void;
  closeAll: () => void;
  unmountAll: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  getProp: <V>(key: PropertyKey, fallback: V) => V;
  getProps: <T extends Record<string, unknown>>(base: T) => T;
  resolve?: (payload: DialogAsyncResolvePayload) => void;
  reject?: (reason?: unknown) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  setStatus: (status: DialogStatus) => void;
}`;

const dialogStackInfoType = `export interface DialogStackInfo {
  topId: DialogId | null;  // 최상단 다이얼로그 ID
  size: number;            // 열린 다이얼로그 개수
  index: number;           // 현재 다이얼로그의 스택 인덱스
}`;

const dialogStateUpdaterType = `export type DialogStateUpdater<TProps = Record<string, unknown>> =
  | TProps
  | Partial<TProps>
  | ((prev: TProps) => TProps | Partial<TProps> | null | undefined);`;

// ─────────────────────────────────────────────────────────────────────────────
// Result Types
// ─────────────────────────────────────────────────────────────────────────────

const dialogOpenResultType = `export type DialogOpenResult<TProps = Record<string, unknown>> = {
  dialog: OpenDialogResult;
  close: () => void;
  unmount: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  setStatus: (status: DialogStatus) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  zIndex: number;
  getProp: <V>(key: PropertyKey, fallback: V) => V;
  getProps: <T extends Record<string, unknown>>(base: T) => T;
}`;

const dialogAsyncResultType = `export type DialogAsyncResult<TProps = Record<string, unknown>, TData = unknown> = 
  DialogOpenResult<TProps> & DialogAsyncResolvePayload<TData>;`;

const dialogAsyncResolvePayloadType = `export type DialogAsyncResolvePayload<T = unknown> = {
  ok: boolean;  // 사용자가 확인/취소 중 무엇을 선택했는지
  data?: T;     // 추가 데이터 (선택)
}`;

const openDialogResultType = `export interface OpenDialogResult {
  id: DialogId;        // 생성된 다이얼로그 ID
  componentKey: string; // React key
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Options Types
// ─────────────────────────────────────────────────────────────────────────────

const openDialogOptionsType = `export type OpenDialogOptions = {
  id?: DialogId;        // 직접 ID 지정
  zIndex?: number;      // z-index 강제 지정
  componentKey?: string; // React key 명시적 제어
}`;

const defineDialogOptionsType = `export interface DefineDialogOptions<TMode extends DialogMode = DialogMode> {
  mode?: TMode;          // 'sync' | 'async'
  displayName?: string;  // 디버깅용 이름
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Registry Types
// ─────────────────────────────────────────────────────────────────────────────

const dialogModeType = `export type DialogMode = 'sync' | 'async';`;

const dialogDefinitionType = `export interface DialogDefinition<TProps, TMode extends DialogMode = 'sync'> {
  mode: TMode;
  render: (input: DialogInput<TProps, DialogControllerContextValue<TProps>>) 
    => DialogRenderFn<TProps>;
}`;

const dialogInputType = `export type DialogInput<TProps, TController> =
  | TProps
  | ((controller: TController) => TProps);`;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const ApiTypesPage = () => (
    <DocArticle title="Types (API Reference)">
        <p className="lead">
            react-layered-dialog에서 export하는 모든 타입을 카테고리별로 정리했습니다.
            각 타입의 역할과 필드를 상세히 설명하여 API 사용 시 참고할 수 있습니다.
        </p>

        <DocCallout variant="tip" title="타입 임포트">
            모든 타입은 <InlineCode>react-layered-dialog</InlineCode> 패키지에서 직접 import할 수 있습니다.
        </DocCallout>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="core-types" title="Core Types">
            <p className="text-sm text-muted-foreground mb-4">
                라이브러리 전반에서 사용되는 기본 타입들입니다.
            </p>

            <Section as="h3" id="dialog-id" title="DialogId">
                <CodeBlock language="ts" code={dialogIdType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    각 다이얼로그를 식별하는 고유 문자열. 자동 생성되거나
                    <InlineCode>open()</InlineCode> 호출 시 직접 지정할 수 있습니다.
                </p>
            </Section>

            <Section as="h3" id="dialog-status" title="DialogStatus">
                <CodeBlock language="ts" code={dialogStatusType} />
                <PropertyTable
                    items={[
                        { name: 'idle', type: 'string', description: '초기 상태. 다이얼로그가 열렸지만 아직 작업 시작 전' },
                        { name: 'loading', type: 'string', description: '비동기 작업 진행 중 (API 호출 등)' },
                        { name: 'done', type: 'string', description: '작업 완료' },
                        { name: 'error', type: 'string', description: '작업 중 에러 발생' },
                    ]}
                />
            </Section>

            <Section as="h3" id="dialog-listener" title="DialogListener">
                <CodeBlock language="ts" code={dialogListenerType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>store.subscribe()</InlineCode>에 전달하는 콜백 함수 타입입니다.
                    스토어 상태가 변경될 때마다 호출됩니다.
                </p>
            </Section>

            <Section as="h3" id="dialog-render-fn" title="DialogRenderFn">
                <CodeBlock language="ts" code={dialogRenderFnType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    다이얼로그 렌더링 함수. <InlineCode>controller</InlineCode>를 인자로 받아
                    렌더링할 ReactNode를 반환합니다. 컨트롤러를 통해 close, update 등의 메서드에 접근 가능합니다.
                </p>
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="entry-types" title="Entry Types">
            <p className="text-sm text-muted-foreground mb-4">
                스토어 내부에 저장되는 다이얼로그 엔트리 관련 타입입니다.
            </p>

            <Section as="h3" id="dialog-entry" title="DialogEntry">
                <CodeBlock language="ts" code={dialogEntryType} />
                <PropertyTable
                    items={[
                        { name: 'id', type: 'DialogId', description: '다이얼로그 고유 ID', required: true },
                        { name: 'renderer', type: 'DialogRenderFn', description: '렌더링 함수', required: true },
                        { name: 'componentKey', type: 'string', description: 'React 리렌더링용 고유 Key. 동일 ID라도 재마운트 필요시 갱신', required: true },
                        { name: 'isOpen', type: 'boolean', description: '다이얼로그가 열려 있는지 여부. close() 시 false로 전환', required: true },
                        { name: 'zIndex', type: 'number', description: 'z-index 값. 자동 증가 또는 직접 지정', required: true },
                        { name: 'state', type: 'Record<string, unknown>', description: '사용자 정의 상태. update()로 변경', required: true },
                        { name: 'asyncHandlers', type: 'DialogAsyncEntryHandlers', description: '비동기 다이얼로그의 resolve/reject 핸들러' },
                        { name: 'meta', type: 'DialogEntryMeta', description: '내부 메타 데이터 (상태 등)', required: true },
                    ]}
                />
            </Section>

            <Section as="h3" id="dialog-entry-meta" title="DialogEntryMeta">
                <CodeBlock language="ts" code={dialogEntryMetaType} />
                <PropertyTable
                    items={[
                        { name: 'status', type: 'DialogStatus', description: '현재 다이얼로그 상태 (idle, loading, done, error)', required: true },
                    ]}
                />
            </Section>

            <Section as="h3" id="dialog-store-snapshot" title="DialogStoreSnapshot">
                <CodeBlock language="ts" code={dialogStoreSnapshotType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>store.getSnapshot()</InlineCode>이 반환하는 스냅샷 구조입니다.
                    <InlineCode>useSyncExternalStore</InlineCode>와 함께 사용됩니다.
                </p>
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="controller-types" title="Controller Types">
            <p className="text-sm text-muted-foreground mb-4">
                다이얼로그 컴포넌트 내부에서 사용하는 컨트롤러 관련 타입입니다.
            </p>

            <Section as="h3" id="dialog-controller-context-value" title="DialogControllerContextValue">
                <CodeBlock language="ts" code={dialogControllerType} />
                <PropertyTable
                    items={[
                        { name: 'id', type: 'DialogId', description: '현재 다이얼로그 ID', required: true },
                        { name: 'isOpen', type: 'boolean', description: '다이얼로그가 열려 있는지 여부', required: true },
                        { name: 'state', type: 'TProps', description: '사용자 정의 상태', required: true },
                        { name: 'zIndex', type: 'number', description: '현재 z-index 값', required: true },
                        { name: 'handle', type: 'OpenDialogResult', description: '다이얼로그 핸들 (id, componentKey)', required: true },
                        { name: 'stack', type: 'DialogStackInfo', description: '현재 스택 정보 (topId, size, index)', required: true },
                        { name: 'close', type: '() => void', description: '현재 다이얼로그 닫기 (isOpen=false)', required: true },
                        { name: 'unmount', type: '() => void', description: '다이얼로그 완전 제거 (DOM에서 삭제)', required: true },
                        { name: 'closeAll', type: '() => void', description: '모든 다이얼로그 닫기', required: true },
                        { name: 'unmountAll', type: '() => void', description: '모든 다이얼로그 제거', required: true },
                        { name: 'update', type: '(updater) => void', description: '상태 업데이트. 객체 또는 함수형 업데이트 지원', required: true },
                        { name: 'getProp', type: '<V>(key, fallback) => V', description: '특정 필드 값을 안전하게 조회 (fallback 반환)', required: true },
                        { name: 'getProps', type: '<T>(base) => T', description: '현재 state를 기본 객체와 병합해 반환', required: true },
                        { name: 'resolve', type: '(payload) => void', description: '비동기 다이얼로그에서 결과 resolve (async 모드 전용)' },
                        { name: 'reject', type: '(reason?) => void', description: '비동기 다이얼로그에서 Promise reject (async 모드 전용)' },
                        { name: 'status', type: 'DialogStatus', description: '현재 상태', required: true },
                        { name: 'getStatus', type: '() => DialogStatus', description: '상태 조회 함수', required: true },
                        { name: 'setStatus', type: '(status) => void', description: '상태 설정 함수', required: true },
                    ]}
                />
            </Section>

            <Section as="h3" id="dialog-stack-info" title="DialogStackInfo">
                <CodeBlock language="ts" code={dialogStackInfoType} />
                <PropertyTable
                    items={[
                        { name: 'topId', type: 'DialogId | null', description: '현재 열려 있는 다이얼로그 중 최상단 ID', required: true },
                        { name: 'size', type: 'number', description: '열린 다이얼로그의 총 개수', required: true },
                        { name: 'index', type: 'number', description: '현재 다이얼로그의 스택 인덱스 (0부터 시작)', required: true },
                    ]}
                />
                <DocCallout variant="tip" title="스택 정보 활용">
                    <InlineCode>stack.topId === id</InlineCode>를 비교하여 현재 다이얼로그가 최상단인지 확인할 수 있습니다.
                    이를 통해 최상단 다이얼로그만 키보드 이벤트를 처리하는 등의 패턴을 구현할 수 있습니다.
                </DocCallout>
            </Section>

            <Section as="h3" id="dialog-state-updater" title="DialogStateUpdater">
                <CodeBlock language="ts" code={dialogStateUpdaterType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>update()</InlineCode> 메서드에 전달할 수 있는 업데이터 타입입니다.
                    세 가지 형태를 지원합니다:
                </p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>전체 상태 객체: <InlineCode>{`update({ count: 5 })`}</InlineCode></li>
                    <li>부분 업데이트: <InlineCode>{`update({ count: 5 })`}</InlineCode> (기존 상태와 병합)</li>
                    <li>함수형 업데이트: <InlineCode>{`update(prev => ({ count: prev.count + 1 }))`}</InlineCode></li>
                </ul>
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="result-types" title="Result Types">
            <p className="text-sm text-muted-foreground mb-4">
                <InlineCode>open()</InlineCode>과 <InlineCode>openAsync()</InlineCode>가 반환하는 결과 타입입니다.
            </p>

            <Section as="h3" id="dialog-open-result" title="DialogOpenResult">
                <CodeBlock language="ts" code={dialogOpenResultType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>store.open()</InlineCode> 호출 시 즉시 반환되는 핸들입니다.
                    이 핸들을 통해 다이얼로그를 외부에서 제어할 수 있습니다.
                </p>
            </Section>

            <Section as="h3" id="dialog-async-result" title="DialogAsyncResult">
                <CodeBlock language="ts" code={dialogAsyncResultType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>store.openAsync()</InlineCode>가 반환하는 Promise의 resolve 값입니다.
                    <InlineCode>DialogOpenResult</InlineCode>에 <InlineCode>ok</InlineCode>와 <InlineCode>data</InlineCode>가 추가됩니다.
                </p>
            </Section>

            <Section as="h3" id="dialog-async-resolve-payload" title="DialogAsyncResolvePayload">
                <CodeBlock language="ts" code={dialogAsyncResolvePayloadType} />
                <PropertyTable
                    items={[
                        { name: 'ok', type: 'boolean', description: '사용자가 확인(true) 또는 취소(false)를 선택했는지', required: true },
                        { name: 'data', type: 'T', description: '추가 데이터 (사용자 입력값 등)' },
                    ]}
                />
            </Section>

            <Section as="h3" id="open-dialog-result" title="OpenDialogResult">
                <CodeBlock language="ts" code={openDialogResultType} />
                <PropertyTable
                    items={[
                        { name: 'id', type: 'DialogId', description: '생성된 다이얼로그 ID', required: true },
                        { name: 'componentKey', type: 'string', description: 'React key (리렌더링 제어용)', required: true },
                    ]}
                />
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="options-types" title="Options Types">
            <p className="text-sm text-muted-foreground mb-4">
                다이얼로그 생성 및 정의 시 전달하는 옵션 타입입니다.
            </p>

            <Section as="h3" id="open-dialog-options" title="OpenDialogOptions">
                <CodeBlock language="ts" code={openDialogOptionsType} />
                <PropertyTable
                    items={[
                        { name: 'id', type: 'DialogId', description: '다이얼로그 ID 직접 지정. 미지정 시 자동 생성' },
                        { name: 'zIndex', type: 'number', description: 'z-index 강제 지정. 미지정 시 자동 증가' },
                        { name: 'componentKey', type: 'string', description: 'React key 명시적 제어. 동일 ID로 재마운트 필요시 사용' },
                    ]}
                />
            </Section>

            <Section as="h3" id="define-dialog-options" title="DefineDialogOptions">
                <CodeBlock language="ts" code={defineDialogOptionsType} />
                <PropertyTable
                    items={[
                        { name: 'mode', type: "'sync' | 'async'", description: "다이얼로그 모드. 'async'면 Promise 반환", defaultValue: "'sync'" },
                        { name: 'displayName', type: 'string', description: 'React DevTools에서 표시될 이름' },
                    ]}
                />
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="registry-types" title="Registry Types">
            <p className="text-sm text-muted-foreground mb-4">
                <InlineCode>createDialogApi</InlineCode>와 <InlineCode>defineDialog</InlineCode>에서 사용하는 타입입니다.
            </p>

            <Section as="h3" id="dialog-mode" title="DialogMode">
                <CodeBlock language="ts" code={dialogModeType} />
                <PropertyTable
                    items={[
                        { name: 'sync', type: 'string', description: '동기 모드. open() → DialogOpenResult 즉시 반환' },
                        { name: 'async', type: 'string', description: '비동기 모드. openAsync() → Promise<DialogAsyncResult> 반환' },
                    ]}
                />
            </Section>

            <Section as="h3" id="dialog-definition" title="DialogDefinition">
                <CodeBlock language="ts" code={dialogDefinitionType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    <InlineCode>defineDialog()</InlineCode>가 반환하는 정의 객체입니다.
                    <InlineCode>createDialogApi</InlineCode> 레지스트리에 직접 전달할 수 있습니다.
                </p>
            </Section>

            <Section as="h3" id="dialog-input" title="DialogInput">
                <CodeBlock language="ts" code={dialogInputType} />
                <p className="mt-2 text-sm text-muted-foreground">
                    다이얼로그를 열 때 전달하는 입력 타입입니다. 두 가지 형태를 지원합니다:
                </p>
                <ul className="mt-2 ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                    <li>직접 props 전달: <InlineCode>{`dialog.alert({ title: '알림' })`}</InlineCode></li>
                    <li>컨트롤러 팩토리: <InlineCode>{`dialog.confirm(c => ({ onConfirm: () => c.resolve?.({ ok: true }) }))`}</InlineCode></li>
                </ul>
                <DocCallout variant="info" title="컨트롤러 팩토리 패턴">
                    함수 형태를 사용하면 컨트롤러의 <InlineCode>resolve</InlineCode>, <InlineCode>reject</InlineCode> 등에
                    접근하여 비동기 다이얼로그의 결과를 제어할 수 있습니다.
                </DocCallout>
            </Section>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="related" title="Related">
            <DocLinks
                links={[
                    { to: '/api/dialog-store', label: 'API → DialogStore' },
                    { to: '/api/create-dialog-api', label: 'API → createDialogApi' },
                    { to: '/api/define-dialog', label: 'API → defineDialog' },
                    { to: '/api/use-dialog-controller', label: 'API → useDialogController' },
                    { to: '/building-dialogs/defining', label: '구현 가이드 → 다이얼로그 타입 설계' },
                ]}
            />
        </Section>
    </DocArticle>
);
