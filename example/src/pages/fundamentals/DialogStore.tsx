import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import dialogsTsCode from '@/code-templates/dialogs.ts.txt?raw';
import { DocLink, DocLinks } from '@/components/docs/DocLink';

const syncAsyncSnippet = `// 동기(open): 즉시 제어 핸들을 반환합니다.
const sync = dialog.store.open(() => <Alert title="안내" message="완료되었습니다" />);
sync.update({ message: '다시 시도해 주세요' });
sync.setStatus('done');
sync.close();

// 비동기(openAsync): Promise를 반환하며 ok 플래그를 제공합니다.
const asyncResult = await dialog.store.openAsync(() => (
  <Confirm title="삭제" message="정말 삭제할까요?" />
));
if (asyncResult.ok) {
  asyncResult.setStatus('loading');
  // ...작업 후
  asyncResult.close();
}`;

// 반환 형태 상세 시그니처는 API 문서로 이동했습니다.

export const DialogStorePage = () => (
  <DocArticle title="DialogStore">
    <p className="lead">
      <InlineCode>DialogStore</InlineCode>는 모든 다이얼로그 스택을 보관하는
      코어 클래스입니다. 렌더링 책임은 전적으로 애플리케이션에 남겨두고, 스택
      조작과 상태 동기화에 필요한 최소한의 인터페이스만 제공합니다.
    </p>

    <Section as="h2" id="overview" title="Key Behaviors">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>open</InlineCode>/<InlineCode>openAsync</InlineCode>:
          렌더러 함수를 스택에 추가하고 제어 핸들(닫기/업데이트/상태)을
          제공합니다.
        </li>
        <li>
          <InlineCode>close</InlineCode>/<InlineCode>unmount</InlineCode>: 닫힘
          전환(<InlineCode>isOpen=false</InlineCode>)과 제거(스택에서 삭제)를
          분리해 퇴장 애니메이션을 안전하게 처리합니다.
        </li>
        <li>
          <InlineCode>subscribe</InlineCode>/
          <InlineCode>getSnapshot</InlineCode>:{' '}
          <InlineCode>useSyncExternalStore</InlineCode>와 호환되는 구독/스냅샷
          인터페이스입니다.
        </li>
        <li>
          z-index: <InlineCode>baseZIndex</InlineCode>(기본 1000)에서 시작해
          open마다 1씩 증가하며, 스택이 비면 초기화됩니다.
        </li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        자세한 시그니처는 <DocLink to="/api/dialog-store">API → DialogStore</DocLink>
        를 참조하세요.
      </p>
    </Section>

    <Section as="h2" id="sync-async" title="Sync/Async at a Glance">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>open</InlineCode>은 즉시{' '}
          <InlineCode>DialogOpenResult&lt;TProps&gt;</InlineCode>를 반환해 제어
          메서드(<InlineCode>close</InlineCode>,{' '}
          <InlineCode>unmount</InlineCode>, <InlineCode>update</InlineCode>,
          <InlineCode>setStatus</InlineCode>)와 메타(
          <InlineCode>status</InlineCode>, <InlineCode>getStatus()</InlineCode>,
          <InlineCode>zIndex</InlineCode>)를 제공합니다.
        </li>
        <li>
          <InlineCode>openAsync</InlineCode>는{' '}
          <InlineCode>
            Promise&lt;DialogAsyncResult&lt;TProps&gt;&gt;
          </InlineCode>
          를 반환하며, 호출부에서 <InlineCode>await</InlineCode>로{' '}
          <InlineCode>ok</InlineCode> 결과를 분기합니다.
        </li>
        <li>
          선택 기준: 간단한 알림/폼 등은 <InlineCode>open</InlineCode>,
          확인/승인 흐름은
          <InlineCode>openAsync</InlineCode>가 사용하기 편합니다.
        </li>
      </ul>
      <CodeBlock language="tsx" code={syncAsyncSnippet} />
    </Section>

    <Section as="h2" id="return-shape" title="Return Summary">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          동기 핸들: <InlineCode>close</InlineCode>,{' '}
          <InlineCode>unmount</InlineCode>, <InlineCode>update</InlineCode>,
          <InlineCode>setStatus</InlineCode>,{' '}
          <InlineCode>status/getStatus</InlineCode>,{' '}
          <InlineCode>zIndex</InlineCode> 제공.
        </li>
        <li>
          비동기 핸들: 위 항목에 더해 <InlineCode>ok: boolean</InlineCode>으로
          결과 분기.
        </li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        필드 정의는 <DocLink to="/api/types">API → 타입 모음</DocLink>에서 확인하세요.
      </p>
    </Section>

    <Section as="h2" id="constructor" title="Constructor and Defaults">
      <p>
        스토어는 클래스 인스턴스로 생성하며,{' '}
        <InlineCode>{`new DialogStore({ baseZIndex })`}</InlineCode>처럼 옵션
        객체로 시작 z-index를 지정할 수 있습니다. 새 다이얼로그가 열릴 때마다 이
        값이 자동으로 증가해 중첩 레이어 순서를 쉽게 보장합니다.
      </p>
      <CodeBlock
        language="ts"
        code={`const dialogStore = new DialogStore({ baseZIndex: 1200 });`}
      />
    </Section>

    <Section as="h2" id="open-close" title="Open and Close">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>open</InlineCode>은 렌더러 함수를 받아 스택에 동기
          다이얼로그를 추가합니다.
        </li>
        <li>
          <InlineCode>openAsync</InlineCode>는 Promise 기반 다이얼로그를 열어{' '}
          <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode>로
          결과를 전달합니다.
        </li>
        <li>
          <InlineCode>close</InlineCode>와 <InlineCode>unmount</InlineCode>는
          ID를 명시하지 않으면 가장 최근 다이얼로그를 대상으로 합니다.
        </li>
        <li>
          <InlineCode>closeAll</InlineCode>과{' '}
          <InlineCode>unmountAll</InlineCode>은 전체 스택을 한 번에 정리할 때
          사용합니다.
        </li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        실전에서는 <InlineCode>createDialogApi</InlineCode>로 스토어를 래핑해{' '}
        <InlineCode>dialog.open</InlineCode>,{' '}
        <InlineCode>dialog.alert</InlineCode> 같은 헬퍼를 생성하는 편이 가장
        일반적입니다.
      </p>
    </Section>

    <Section as="h2" id="state-management" title="State Updates and Meta">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>update</InlineCode>는 다이얼로그가 보유한 사용자 정의
          상태를 부분 업데이트할 때 사용합니다.
        </li>
        <li>
          <InlineCode>setStatus</InlineCode>와{' '}
          <InlineCode>getStatus</InlineCode>는{' '}
          <InlineCode>openAsync</InlineCode> 플로우에서 로딩·완료 같은 진행
          상태를 추적할 때 유용합니다.
        </li>
        <li>
          <InlineCode>open/openAsync</InlineCode>의 반환값에는{' '}
          <InlineCode>status</InlineCode> 게터와
          <InlineCode>getStatus()</InlineCode>가 함께 제공됩니다.{' '}
          <InlineCode>status</InlineCode>는 현재 값에 접근하기 쉽고, 비동기 콜백
          등 최신 값이 필요한 경우에는 <InlineCode>getStatus()</InlineCode>를
          사용하세요.
        </li>
        <li>
          다이얼로그 컴포넌트 내부에서는{' '}
          <InlineCode>useDialogController</InlineCode>가 이 메서드를 래핑한{' '}
          <InlineCode>update</InlineCode>, <InlineCode>setStatus</InlineCode>{' '}
          함수와 함께
          <InlineCode>status</InlineCode>/<InlineCode>getStatus()</InlineCode>{' '}
          값을 제공합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="subscription" title="Subscription and Snapshot">
      <p>
        <InlineCode>subscribe</InlineCode>와{' '}
        <InlineCode>getSnapshot</InlineCode> 쌍은{' '}
        <InlineCode>useSyncExternalStore</InlineCode>와 바로 호환됩니다.
        렌더러나 커스텀 훅에서 다음과 같이 사용할 수 있습니다.
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
        이 패턴을 활용하면 <InlineCode>DialogRenderer</InlineCode> 같은 래퍼
        컴포넌트가 전역 상태를 손쉽게 감시하고, scroll lock·포커스 제어 같은
        정책을 덧붙일 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="patterns" title="Usage Patterns and Notes">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          스토어는 전역 싱글턴일 필요가 없습니다. SSR 환경이라면 요청 단위로
          생성하세요.
        </li>
        <li>
          여러 스토어를 병행해 사용하면 독립된 스택을 구성할 수 있습니다. 이때
          렌더러도 각각 연결해야 정상적으로 컨트롤러 컨텍스트가 주입됩니다.
        </li>
        <li>
          <InlineCode>baseZIndex</InlineCode>는 선택 사항입니다. 프로젝트의
          레이어 정책에 맞춰 필요한 경우에만 지정하세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="reference-code" title="Reference Code">
      <p>
        아래 스니펫은 Alert/Confirm 두 가지 다이얼로그를 등록한 대표적인 구성을
        보여 줍니다. <InlineCode>createDialogApi</InlineCode>에서 반환된{' '}
        <InlineCode>dialog</InlineCode> 객체를 프로젝트 전역에서 재사용하면 호출
        시점부터 타입이 안전하게 추론됩니다.
      </p>
      <CodeBlock language="ts" code={dialogsTsCode} />
    </Section>
    <Section as="h2" id="api-links" title="API Docs">
      <DocLinks
        links={[
          { to: '/api/dialog-store', label: 'API → DialogStore' },
          { to: '/api/types', label: 'API → 타입 모음' },
        ]}
      />
    </Section>
  </DocArticle>
);
