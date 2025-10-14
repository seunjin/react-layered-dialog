import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const overviewCode = `// src/lib/dialogs.ts
import { createDialogManager, createUseDialogs } from 'react-layered-dialog';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import type { DialogState } from 'react-layered-dialog';

type AppDialogState =
  | { type: 'alert'; message: string }
  | { type: 'confirm'; question: string };

const { manager } = createDialogManager<AppDialogState>();
export const useDialogs = createUseDialogs(manager, {
  alert: ({ id, message }) => (
    <AlertDialog key={id} message={message} />
  ),
  confirm: ({ id, question }) => (
    <ConfirmDialog key={id} question={question} />
  ),
});

export const openDialog = manager.openDialog;
export const closeDialog = manager.closeDialog;
export const updateDialog = manager.updateDialog;`;

export const Architecture = () => (
  <DocArticle title="코어 아키텍처">
    <p className="lead">
      <InlineCode>react-layered-dialog</InlineCode>의 코어는 단순한 스토어와 훅
      조합입니다. 다이얼로그 상태를 배열(Stack)로 관리하고, 필요한 동작은
      개발자가 직접 선언적으로 정의합니다.
    </p>

    <Section as="h2" id="pieces" title="필수 구성 요소">
      <ol className="ml-6 list-decimal space-y-2">
        <li>
          <b>DialogManager</b>: 다이얼로그 배열을 관리하는 얇은 스토어입니다.
          상태 구독, 열기/닫기/업데이트가 전부입니다.
        </li>
        <li>
          <b>createUseDialogs</b>: 매니저를 React
          컴포넌트와 연결하는 맞춤형 훅을 생성합니다. 다이얼로그 타입과 컴포넌트를
          매핑하는 것은 개발자의 책임입니다.
        </li>
        <li>
          <b>DialogRenderer</b>: 현재 열린 다이얼로그를 실제 DOM에 렌더링하는
          얇은 프리미티브입니다. 원하는 렌더러를 직접 구현해도 무방합니다.
        </li>
      </ol>
    </Section>

    <Section as="h2" id="flow" title="데이터 흐름">
      <p>
        매니저는 내부적으로 단순한 배열을 유지합니다. <InlineCode>openDialog</InlineCode>{' '}
        로 새로운 엔트리를 추가하고, <InlineCode>closeDialog</InlineCode> 또는{' '}
        <InlineCode>closeAllDialogs</InlineCode>
        로 제거합니다. <InlineCode>updateDialog</InlineCode>는 부분 갱신을 수행하지만
        어떤 필드가 존재하는지에 대한 판단은 호출자에게 맡깁니다.
      </p>

      <CodeBlock language="ts" code={overviewCode} />
      <p>
        위 코드는 라이브러리 코어가 제공하는 모든 기능을 나열한 예시입니다.{' '}
        <InlineCode>DialogRenderer</InlineCode>는 단지 열린 다이얼로그를 순서대로
        렌더링할 뿐이며, 포커스 처리나 오버레이 등은 개발자가 직접 구현하거나
        애드온을 선택적으로 사용하면 됩니다.
      </p>
    </Section>

    <Section as="h2" id="principles" title="설계 원칙">
      <ul className="ml-6 list-disc space-y-2">
        <li>
          <b>최소주의</b>: 코어는 상태 관리 외의 정책을 강요하지 않습니다.
          dim 처리, 스크롤 잠금, 포커스 트랩 등은 선택 사항입니다.
        </li>
        <li>
          <b>명시적 선언</b>: 다이얼로그 타입과 UI 컴포넌트를 명시적으로 연결해
          타입 안전성과 DX를 동시에 확보합니다.
        </li>
        <li>
          <b>플러그형 확장</b>: 코어 API는 얇게 유지하고, 필요한 경우
          추가 유틸리티(예: <InlineCode>useLayerBehavior</InlineCode>)를 조합하는
          구조를 지향합니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
