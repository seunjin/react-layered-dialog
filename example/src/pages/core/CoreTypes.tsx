import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const snapshotSnippet = `interface DialogEntry {
  id: DialogId;
  renderer: DialogRenderFn;
  componentKey: string;
  isOpen: boolean;
  isMounted: boolean;
  zIndex: number;
  state: Record<string, unknown>;
  options: Record<string, unknown> & { zIndex: number };
  asyncHandlers?: DialogAsyncEntryHandlers;
  meta: { status: DialogStatus };
}

interface DialogStoreSnapshot {
  entries: DialogEntry[];
}`;

const openResultSnippet = `type DialogOpenResult<TProps, TOptions> = {
  dialog: OpenDialogResult;
  close: () => void;
  unmount: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  setStatus: (status: DialogStatus) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  options: TOptions & { zIndex: number };
};

type DialogAsyncResult<TProps, TOptions> = DialogOpenResult<TProps, TOptions> & {
  ok: boolean;
};`;

const controllerSnippet = `interface DialogControllerContextValue<TProps, TOptions> {
  id: DialogId;
  isOpen: boolean;
  state: TProps;
  options: TOptions & { zIndex: number };
  handle: OpenDialogResult;
  close: () => void;
  unmount: () => void;
  closeAll: () => void;
  unmountAll: () => void;
  update: (updater: DialogStateUpdater<TProps>) => void;
  getStateField: <V>(key: PropertyKey, fallback: V) => V;
  getStateFields: <B extends Record<string, unknown>>(base: B) => B & Partial<TProps>;
  stack: DialogStackInfo;
  resolve?: (payload: DialogAsyncResolvePayload) => void;
  reject?: (reason?: unknown) => void;
  status: DialogStatus;
  getStatus: () => DialogStatus;
  setStatus: (status: DialogStatus) => void;
}`;

const updaterSnippet = `type DialogStateUpdater<TProps> =
  | TProps
  | Partial<TProps>
  | ((prev: TProps) => TProps | Partial<TProps> | null | undefined);`;

const stackSnippet = `interface DialogStackInfo {
  topId: DialogId | null;
  size: number;
  index: number;
}`;

export const CoreTypes = () => (
  <DocArticle title="핵심 타입 가이드">
    <p className="lead">
      패키지가 제공하는 타입은 대부분 스토어 스냅샷과 컨트롤러 계약을 설명합니다.
      이 문서에서는 다이얼로그를 설계하거나 테스트할 때 알아 두면 좋은 핵심 타입을
      정리합니다.
    </p>

    <Section as="h2" id="snapshot" title="DialogStoreSnapshot & DialogEntry">
      <p>
        <InlineCode>DialogStoreSnapshot</InlineCode>은 스토어가 노출하는 최소 단위입니다.
        <InlineCode>useSyncExternalStore</InlineCode>로 구독해도 되도록 불변 객체 구조를 사용합니다.
      </p>
      <CodeBlock language="ts" code={snapshotSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>options</InlineCode>는 항상 <InlineCode>zIndex</InlineCode>를 포함합니다.
          사용자 정의 옵션을 추가하면 그대로 유지됩니다.
        </li>
        <li>
          <InlineCode>meta.status</InlineCode>는 <InlineCode>&apos;idle&apos; | &apos;loading&apos; | &apos;done&apos; | &apos;error&apos;</InlineCode> 중 하나입니다.
          비동기 다이얼로그에서 진행 상태를 표현할 때 유용합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="open-result" title="DialogOpenResult & DialogAsyncResult">
      <p>
        <InlineCode>open</InlineCode>과 <InlineCode>openAsync</InlineCode>는 제어 함수를 포함한 결과 객체를 반환합니다.
        비동기 버전은 <InlineCode>ok</InlineCode> 플래그가 추가되며 Promise로 감싸져 있습니다.
      </p>
      <CodeBlock language="ts" code={openResultSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>update</InlineCode>와 <InlineCode>setStatus</InlineCode>는 동일한 ID를 대상으로 작동합니다.
          resolve 이후에도 호출할 수 있으므로 후속 애니메이션을 구성할 수 있습니다.
        </li>
        <li>
          <InlineCode>options</InlineCode>는 다이얼로그 열 때 전달한 옵션의 스냅샷입니다.
          렌더링 시점에 동일한 값을 참조하고 싶다면 컨트롤러의 <InlineCode>options</InlineCode> 대신
          결과 객체를 활용하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="controller" title="DialogControllerContextValue">
      <p>
        <InlineCode>useDialogController</InlineCode> 훅은 이 컨텍스트 값을 반환합니다.
        컴포넌트 내부에서 상태를 업데이트하거나 다른 다이얼로그와 상호작용할 수 있는
        모든 수단이 포함되어 있습니다.
      </p>
      <CodeBlock language="ts" code={controllerSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>stack</InlineCode>에는 현재 스택 크기와 최상단 여부가 포함됩니다.
          중첩 다이얼로그에서 포커스 정책을 조정할 때 유용합니다.
        </li>
        <li>
          <InlineCode>getStateField</InlineCode>와 <InlineCode>getStateFields</InlineCode>는
          안전하게 사용자 정의 상태를 읽을 수 있도록 도와주는 헬퍼입니다.
          상태가 아직 설정되지 않았을 때도 기본값을 반환합니다.
        </li>
      </ul>
      <CodeBlock language="ts" code={stackSnippet} />
    </Section>

    <Section as="h2" id="updater" title="DialogStateUpdater">
      <p>
        <InlineCode>DialogStateUpdater</InlineCode>는 <InlineCode>open</InlineCode> 결과나 컨트롤러에서
        상태를 갱신할 때 사용하는 타입입니다. 객체를 넘기거나 함수형 업데이트를 사용할 수 있으며,
        <InlineCode>null</InlineCode> 또는 <InlineCode>undefined</InlineCode>를 반환하면 변경이 무시됩니다.
      </p>
      <CodeBlock language="ts" code={updaterSnippet} />
      <p className="text-sm text-muted-foreground">
        updater 함수는 기존 상태를 기반으로 부분 업데이트를 수행할 수 있습니다.
        값이 <InlineCode>null</InlineCode> 또는 <InlineCode>undefined</InlineCode>이면 변경이 취소되므로,
        조건부 업데이트를 구현할 때 유용합니다.
      </p>
    </Section>
  </DocArticle>
);
