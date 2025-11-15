import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';

const signature = `class DialogStore {
  constructor(options?: { baseZIndex?: number });

  open<TProps, TOptions>(
    renderer: DialogRenderFn<TProps, TOptions>,
    options?: OpenDialogOptions<TOptions>
  ): DialogOpenResult<TProps, TOptions>;
  openAsync<TProps, TOptions>(
    renderer: DialogRenderFn<TProps, TOptions>,
    options?: OpenDialogOptions<TOptions>
  ): Promise<DialogAsyncResult<TProps, TOptions>>;

  close(id?: DialogId): void;
  unmount(id?: DialogId): void;
  closeAll(): void;
  unmountAll(): void;

  update<TProps>(id: DialogId, updater: DialogStateUpdater<TProps>): void;
  setStatus(id: DialogId, status: DialogStatus): void;
  getStatus(id: DialogId): DialogStatus;

  subscribe(listener: DialogListener): () => void;
  getSnapshot(): DialogStoreSnapshot;
}`;

export const DialogStorePage = () => (
  <DocArticle title="DialogStore">
    <p className="lead">
      <InlineCode>DialogStore</InlineCode>는 모든 다이얼로그 스택을 보관하는 코어 클래스입니다.
      렌더링 책임은 전적으로 애플리케이션에 남겨두고, 스택 조작과 상태 동기화에 필요한 최소한의
      인터페이스만 제공합니다.
    </p>

    <Section as="h2" id="signature" title="주요 메서드">
      <CodeBlock language="ts" code={signature} />
      <p className="mt-2 text-sm text-muted-foreground">
        생성자에 전달할 수 있는 <InlineCode>baseZIndex</InlineCode>는 선택 사항입니다. 지정하지
        않으면 기본값(1000)에서 시작하며, 다이얼로그가 열릴 때마다 1씩 증가합니다.
      </p>
    </Section>

    <Section as="h2" id="constructor" title="생성자와 기본 상태">
      <p>
        스토어는 클래스 인스턴스로 생성하며, <InlineCode>{`new DialogStore({ baseZIndex })`}</InlineCode>처럼
        옵션 객체로 시작 z-index를 지정할 수 있습니다. 새 다이얼로그가 열릴 때마다 이 값이 자동으로
        증가해 중첩 레이어 순서를 쉽게 보장합니다.
      </p>
      <CodeBlock
        language="ts"
        code={`const dialogStore = new DialogStore({ baseZIndex: 1200 });`}
      />
    </Section>

    <Section as="h2" id="open-close" title="열고 닫기">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>open</InlineCode>은 렌더러 함수를 받아 스택에 동기 다이얼로그를 추가합니다.
        </li>
        <li>
          <InlineCode>openAsync</InlineCode>는 Promise 기반 다이얼로그를 열어{' '}
          <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>로 결과를 전달합니다.
        </li>
        <li>
          <InlineCode>close</InlineCode>와 <InlineCode>unmount</InlineCode>는 ID를 명시하지 않으면
          가장 최근 다이얼로그를 대상으로 합니다.
        </li>
        <li>
          <InlineCode>closeAll</InlineCode>과 <InlineCode>unmountAll</InlineCode>은 전체 스택을 한 번에
          정리할 때 사용합니다.
        </li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        실전에서는 <InlineCode>createDialogApi</InlineCode>로 스토어를 래핑해{' '}
        <InlineCode>dialog.open</InlineCode>, <InlineCode>dialog.alert</InlineCode> 같은 헬퍼를
        생성하는 편이 가장 일반적입니다.
      </p>
    </Section>

    <Section as="h2" id="state-management" title="상태 업데이트와 메타 정보">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>update</InlineCode>는 다이얼로그가 보유한 사용자 정의 상태를 부분 업데이트할 때
          사용합니다.
        </li>
        <li>
          <InlineCode>setStatus</InlineCode>와 <InlineCode>getStatus</InlineCode>는{' '}
          <InlineCode>openAsync</InlineCode> 플로우에서 로딩·완료 같은 진행 상태를 추적할 때 유용합니다.
        </li>
        <li>
          다이얼로그 컴포넌트 내부에서는 <InlineCode>useDialogController</InlineCode>가 이 메서드를
          래핑한 <InlineCode>update</InlineCode>, <InlineCode>setStatus</InlineCode> 함수를 제공합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="subscription" title="구독과 스냅샷">
      <p>
        <InlineCode>subscribe</InlineCode>와 <InlineCode>getSnapshot</InlineCode> 쌍은{' '}
        <InlineCode>useSyncExternalStore</InlineCode>와 바로 호환됩니다. 렌더러나 커스텀 훅에서
        다음과 같이 사용할 수 있습니다.
      </p>
      <CodeBlock
        language="ts"
        code={`const snapshot = useSyncExternalStore(
  dialogStore.subscribe,
  dialogStore.getSnapshot,
  dialogStore.getSnapshot
);`}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        이 패턴을 활용하면 <InlineCode>DialogRenderer</InlineCode> 같은 래퍼 컴포넌트가 전역 상태를
        손쉽게 감시하고, scroll lock·포커스 제어 같은 정책을 덧붙일 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="patterns" title="사용 패턴과 주의 사항">
      <ul className="ml-6 list-disc space-y-2">
        <li>스토어는 전역 싱글턴일 필요가 없습니다. SSR 환경이라면 요청 단위로 생성하세요.</li>
        <li>
          여러 스토어를 병행해 사용하면 독립된 스택을 구성할 수 있습니다. 이때 렌더러도 각각 연결해야
          정상적으로 컨트롤러 컨텍스트가 주입됩니다.
        </li>
        <li>
          <InlineCode>baseZIndex</InlineCode>는 선택 사항입니다. 프로젝트의 레이어 정책에 맞춰 필요한
          경우에만 지정하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="reference-code" title="참고 코드">
      <p>
        아래 스니펫은 Alert/Confirm 두 가지 다이얼로그를 등록한 대표적인 구성을 보여 줍니다.{' '}
        <InlineCode>createDialogApi</InlineCode>에서 반환된 <InlineCode>dialog</InlineCode> 객체를
        프로젝트 전역에서 재사용하면 호출 시점부터 타입이 안전하게 추론됩니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
    </Section>
  </DocArticle>
);
