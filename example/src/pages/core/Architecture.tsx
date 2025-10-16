import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';

const storeSnippet = `// src/lib/dialogs.ts
import {
  createDialogManager,
  createUseDialogs,
  type DialogState,
  type DialogInstance,
} from 'react-layered-dialog';
import { Alert } from '@/components/dialogs/Alert';
import { Confirm } from '@/components/dialogs/Confirm';

type AlertState = {
  type: 'alert';
  title: string;
  message: string;
  onOk?: () => void;
};

type ConfirmState = {
  type: 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type AppDialogState = DialogState<AlertState> | DialogState<ConfirmState>;
export type AppDialogInstance = DialogInstance<AppDialogState>;

const { manager } = createDialogManager<AppDialogState>({
  baseZIndex: 1200,
});

export const useDialogs = createUseDialogs(manager, {
  alert: Alert,
  confirm: Confirm,
});

export const openDialog = manager.openDialog;
export const closeDialog = manager.closeDialog;
export const closeAllDialogs = manager.closeAllDialogs;
export const updateDialog = manager.updateDialog;`;

const rendererSnippet = `// src/components/dialogs/DialogRenderer.tsx
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import type { AppDialogInstance } from '@/lib/dialogs';

export const DialogRenderer = ({
  dialogs,
}: {
  dialogs: readonly AppDialogInstance[];
}) => {
  // 선택 사항: scrollLock === true 인 다이얼로그가 있을 때 배경 스크롤 잠금
  const isScrollLocked = dialogs.some(
    (dialog) => 'scrollLock' in dialog.state && dialog.state.scrollLock === true
  );

  useEffect(() => {
    if (!isScrollLocked) {
      document.body.classList.remove('scroll-locked');
      return;
    }

    document.body.classList.add('scroll-locked');
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isScrollLocked]);

  return (
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};`;

export const Architecture = () => (
  <DocArticle title="코어 아키텍처">
    <p className="lead">
      <InlineCode>react-layered-dialog</InlineCode>는 빈약한 전역 스토어 + 타입
      안전한 훅 조합으로 동작합니다. 코어는 다이얼로그 스택과 z-index만
      책임지고, UI·포커스·스크롤 정책은 애플리케이션이 선언적으로 구현합니다.
    </p>

    <Section as="h2" id="system-overview" title="핵심 구성">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <b>DialogManager</b>: 다이얼로그 상태 배열을 보관하고{' '}
          <InlineCode>open</InlineCode>/<InlineCode>close</InlineCode>/
          <InlineCode>update</InlineCode> 동작을 제공합니다.{' '}
          <InlineCode>createDialogManager</InlineCode> 호출 시{' '}
          <InlineCode>baseZIndex</InlineCode> 같은 전역 설정을 주입할 수
          있습니다.
        </li>
        <li>
          <b>createUseDialogs</b>: 매니저를 React 세계로 노출하는 훅
          팩토리입니다. 다이얼로그 <InlineCode>type</InlineCode>과 렌더링할
          컴포넌트를 매핑하는 책임은 앱에 있습니다.
        </li>
        <li>
          <b>DialogRenderer</b>: 열린 다이얼로그 배열을 DOM에 렌더링하는 얇은
          컴포넌트입니다. 포커스, 애니메이션, scroll lock 등은 이 레이어에서
          확장합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="flow" title="데이터 흐름">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          앱이 정의한 <InlineCode>AppDialogState</InlineCode> 유니온을 기반으로
          <InlineCode>createDialogManager</InlineCode>와{' '}
          <InlineCode>createUseDialogs</InlineCode>를 초기화합니다.
        </li>
        <li>
          컴포넌트에서는 <InlineCode>useDialogs</InlineCode>를 호출해{' '}
          <InlineCode>dialogs</InlineCode> 배열과{' '}
          <InlineCode>openDialog</InlineCode> 등의 제어 함수를 받습니다.
        </li>
        <li>
          렌더러는 <InlineCode>dialogs</InlineCode>를 순회하면서 각 항목의{' '}
          <InlineCode>Component</InlineCode>와 <InlineCode>state</InlineCode>를
          그대로 렌더링합니다. dim, 포커스, scroll lock 같은 부가 동작은 렌더러
          혹은 다이얼로그 컴포넌트에서 결정합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="reference" title="참고 구현">
      <p>
        아래 예시는 Alert/Confirm 다이얼로그만 사용하는 최소 스토어 구성을
        보여줍니다.
        <InlineCode>DialogState&lt;T&gt;</InlineCode>를 적용하면 공통 메타 필드(
        <InlineCode>id</InlineCode>, <InlineCode>zIndex</InlineCode>,{' '}
        <InlineCode>dimmed</InlineCode> 등)가 자동으로 합쳐집니다.
      </p>
      <CodeBlock language="ts" code={storeSnippet} />
      <p className="mt-4">
        렌더러는 열린 다이얼로그를 순회하며 렌더링만 담당합니다. 예제에서는
        <InlineCode>scrollLock</InlineCode> 플래그를 보고{' '}
        <InlineCode>body</InlineCode>
        스크롤을 잠그는 선택적 로직을 포함했습니다.
      </p>
      <CodeBlock language="tsx" code={rendererSnippet} />
    </Section>

    <Section as="h2" id="contracts" title="타입 계약 요약">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <InlineCode>BaseLayerProps</InlineCode>와{' '}
          <InlineCode>DialogState&lt;T&gt;</InlineCode>는 모든 다이얼로그가
          공유하는 동작 플래그를 정의합니다. 상세 설명은{' '}
          <InlineCode>Core → 코어 타입 가이드</InlineCode>에서 확인하세요.
        </li>
        <li>
          <InlineCode>DialogInstance&lt;T&gt;</InlineCode>는 다이얼로그{' '}
          <InlineCode>type</InlineCode>과 컴포넌트를 관계형(상관된 유니온)으로
          묶어 잘못된 props 조합을 컴파일 단계에서 차단합니다.
        </li>
        <li>
          <InlineCode>DialogPatch</InlineCode>는{' '}
          <InlineCode>updateDialog</InlineCode>에 전달할 수 있는 부분 상태
          형태이며, 함수 시그니처로 전달하면 이전 상태를 기반으로 파생 값을
          계산할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="extension" title="확장 포인트">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>레이어 동작</b>: ESC/외부 클릭 등은{' '}
          <InlineCode>useLayerBehavior</InlineCode>를 조합하거나 직접 이벤트를
          처리하세요. Quick Start 예제가 기본 패턴을 보여줍니다.
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
          )을 참고해 <InlineCode>AnimatePresence</InlineCode>, 포커스 트랩 등을
          추가하세요.
        </li>

        <li>
          <b>전역 정책</b>: <InlineCode>scrollLock</InlineCode>처럼 전역 상태를
          건드리는 동작은 렌더러 단계에서 명시적으로 관리합니다. 필요 없다면
          해당 로직을 제거해도 됩니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
