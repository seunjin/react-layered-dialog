import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';

const storeSnippet = `// src/lib/dialogs.ts
import { useMemo, useSyncExternalStore } from 'react';
import { DialogStore, createDialogApi } from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

export type DialogBehaviorOptions = {
  dimmed?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  scrollLock?: boolean;
};

export type AlertDialogProps = { title: string; message: string; onOk?: () => void };
export type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm?: () => void | false;
  onCancel?: () => void | false;
  step?: 'confirm' | 'loading' | 'done';
};

export const dialogStore = new DialogStore(1200);

const registry = {
  alert: { component: Alert },
  confirm: { component: Confirm },
} as const;

const dialogApi = createDialogApi(dialogStore, registry);

export const openDialog = dialogApi.open;
export const closeDialog = dialogApi.close;
export const closeAllDialogs = dialogApi.closeAll;
export const unmountDialog = dialogApi.unmount;
export const unmountAllDialogs = dialogApi.unmountAll;
export const updateDialog = dialogApi.update;

export function useDialogs() {
  const snapshot = useSyncExternalStore(
    dialogStore.subscribe,
    dialogStore.getSnapshot,
    dialogStore.getSnapshot
  );

  return useMemo(
    () => ({
      store: dialogStore,
      dialogs: snapshot.entries,
      openDialog,
      closeDialog,
      closeAllDialogs,
      unmountDialog,
      unmountAllDialogs,
      updateDialog,
    }),
    [snapshot]
  );
}`;

const rendererSnippet = `// src/components/dialogs/DialogRenderer.tsx
import { useEffect, useSyncExternalStore } from 'react';
import { DialogsRenderer, type DialogStore } from 'react-layered-dialog';

export const DialogRenderer = ({ store }: { store: DialogStore }) => {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  const isScrollLocked = snapshot.entries.some((entry) => {
    if (entry.options.scrollLock === true) return true;
    const state = entry.state as Record<string, unknown> | undefined;
    return state?.scrollLock === true;
  });

  useEffect(() => {
    if (isScrollLocked) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isScrollLocked]);

  return <DialogsRenderer store={store} />;
};`;

export const Architecture = () => (
  <DocArticle title="코어 아키텍처">
    <p className="lead">
      <InlineCode>react-layered-dialog</InlineCode>는 얇은 전역 스토어와
      레지스트리만 제공하고, UI·동작은 애플리케이션이 직접 구현하는 방식을
      지향합니다. 스택 관리, z-index 계산, 비동기 컨트롤러 같은 필수 기능만
      코어가 책임지고 나머지는 선언적으로 조합할 수 있습니다.
    </p>

    <Section as="h2" id="system-overview" title="핵심 구성 요소">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <b>DialogStore</b>: 다이얼로그 스택과 옵션을 보관하는 클래스입니다.
          <InlineCode>open</InlineCode>, <InlineCode>close</InlineCode>,
          <InlineCode>update</InlineCode> 같은 저수준 메서드를 제공합니다.
        </li>
        <li>
          <b>createDialogApi</b>: 스토어와 레지스트리를 연결해 타입 안전한
          <InlineCode>openDialog</InlineCode>·<InlineCode>closeDialog</InlineCode>
          와 같은 헬퍼를 생성합니다. 각 다이얼로그의 props/옵션 타입이 자동으로
          추론됩니다.
        </li>
        <li>
          <b>DialogsRenderer + useDialogController</b>: 렌더러는 스토어를 구독하고,
          개별 컴포넌트는 컨트롤러 훅을 통해 상태·옵션·제어 함수를 받아 사용합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="flow" title="데이터 흐름">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          하나의 <InlineCode>DialogStore</InlineCode> 인스턴스를 생성하고,
          <InlineCode>createDialogApi</InlineCode>에 스토어와 레지스트리를 전달합니다.
        </li>
        <li>
          렌더러 계층에서는 <InlineCode>DialogsRenderer</InlineCode>에 스토어를 전달해
          컨텍스트를 주입하고, 필요 시 전역 동작(scroll lock 등)을 추가합니다.
        </li>
        <li>
          다이얼로그 컴포넌트 내부에서는 <InlineCode>useDialogController</InlineCode>로
          props, 옵션, <InlineCode>close</InlineCode>/<InlineCode>update</InlineCode> 같은
          제어 함수를 받아 UI와 상호작용을 정의합니다.
        </li>
        <li>
          애플리케이션 어디에서든 <InlineCode>openDialog</InlineCode>,
          <InlineCode>closeDialog</InlineCode>, <InlineCode>updateDialog</InlineCode>를
          호출해 스택을 선언적으로 제어합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="reference" title="참고 구현">
      <p>
        아래 샘플은 Alert/Confirm 두 가지 다이얼로그만 등록한 최소 구성을 보여줍니다.
        스토어는 <InlineCode>useSyncExternalStore</InlineCode>로 구독하고, 필요한
        제어 함수를 훅에서 재노출합니다.
      </p>
      <CodeBlock language="ts" code={storeSnippet} />
      <p className="mt-4">
        렌더러는 스토어 스냅샷을 구독해 전역 scroll-lock을 처리한 뒤,
        <InlineCode>DialogsRenderer</InlineCode>에 위임해 다이얼로그를 실제 DOM에
        렌더링합니다.
      </p>
      <CodeBlock language="tsx" code={rendererSnippet} />
    </Section>

    <Section as="h2" id="contracts" title="타입 계약 요약">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>DialogStoreSnapshot</InlineCode>은 현재 열린 다이얼로그
          엔트리 배열을 제공합니다. 각 엔트리는 <InlineCode>options</InlineCode>와
          <InlineCode>state</InlineCode>, <InlineCode>meta.status</InlineCode> 등을 보관합니다.
        </li>
        <li>
          <InlineCode>DialogControllerContextValue</InlineCode>는 컴포넌트에서 사용할 수 있는
          모든 제어 함수를 담고 있습니다. <InlineCode>close</InlineCode>,
          <InlineCode>unmount</InlineCode>, <InlineCode>update</InlineCode>, 비동기 컨트롤러의
          <InlineCode>resolve</InlineCode>/<InlineCode>reject</InlineCode> 등이 포함됩니다.
        </li>
        <li>
          <InlineCode>DialogStateUpdater</InlineCode>는 객체 혹은 함수형 업데이트를 모두 지원합니다.
          동일한 ID를 가진 다이얼로그의 사용자 정의 상태를 부분 업데이트할 때 활용합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="extension" title="확장 포인트">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>레이어 동작</b>: ESC/외부 클릭 제어는 컨트롤러와 간단한 커스텀 훅을 조합해
          구현합니다. 재사용 가능한 패턴은 <Link to="/guides/controller-patterns" className="text-primary underline">Guides → 컨트롤러 패턴</Link>에서 다룹니다.
        </li>
        <li>
          <b>렌더러 커스터마이징</b>: 애니메이션이 필요하면{' '}
          <Link to="/examples/live-showcase" className="text-primary underline">
            Examples → Live Showcase
          </Link>
          와 코드 템플릿(
          <Link
            to="https://github.com/seunjin/react-layered-dialog/blob/main/example/src/code-templates/AlertAnimated.tsx.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            AlertAnimated.tsx
          </Link>
          ,{' '}
          <Link
            to="https://github.com/seunjin/react-layered-dialog/blob/main/example/src/code-templates/ConfirmAnimated.tsx.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            ConfirmAnimated.tsx
          </Link>
          )을 참고하세요.
        </li>
        <li>
          <b>전역 정책</b>: scroll-lock이나 포커스 트랩처럼 전역 상태를 변경하는 로직은
          렌더러 또는 상위 레이어에서 명시적으로 관리합니다. 필요 없다면 자유롭게 제거해도 됩니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
