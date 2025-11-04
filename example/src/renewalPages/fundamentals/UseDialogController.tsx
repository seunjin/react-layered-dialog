import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const controllerSignature = `function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
>(): DialogControllerContextValue<TProps, TOptions>;`;

const controllerUsage = `import { useDialogController } from 'react-layered-dialog';

type AlertDialogProps = {
  title: string;
  message: string;
};

type AlertOptions = {
  closeOnEscape?: boolean;
};

export function Alert(props: AlertDialogProps) {
  const controller = useDialogController<AlertDialogProps, AlertOptions>();
  const { close, unmount, update, options, stack } = controller;

  const handleConfirm = () => {
    close();
    unmount();
  };

  const isTopMost = stack.index === stack.size - 1;

  return (
    <div role="alertdialog" aria-modal="true" data-topmost={isTopMost}>
      <h3>{props.title}</h3>
      <p>{props.message}</p>
      <button onClick={handleConfirm}>확인</button>
    </div>
  );
}`;

export const UseDialogControllerPage = () => (
  <DocArticle title="useDialogController">
    <p className="lead">
      <InlineCode>useDialogController</InlineCode>는 다이얼로그 컴포넌트 내부에서 close/update/stack 정보를
      제공해 UI와 상호작용을 일관되게 제어할 수 있게 해 줍니다.
    </p>

    <Section as="h2" id="signature" title="시그니처">
      <CodeBlock language="ts" code={controllerSignature} />
    </Section>

    <Section as="h2" id="usage" title="사용 예시">
      <CodeBlock language="tsx" code={controllerUsage} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>stack.index</InlineCode>/<InlineCode>stack.size</InlineCode> 값을 사용해 최상단 여부를
          판단하고 ESC·외부 클릭 처리 조건을 손쉽게 구성할 수 있습니다.
        </li>
        <li>
          <InlineCode>update</InlineCode>는 객체 전체를 교체하거나 부분 업데이트 함수를 전달하는 두 가지
          방식을 모두 지원합니다.
        </li>
        <li>
          비동기 다이얼로그에서는 <InlineCode>setStatus</InlineCode>, <InlineCode>resolve</InlineCode>,{' '}
          <InlineCode>reject</InlineCode>를 활용해 로딩 → 완료 단계 전환을 일관되게 관리할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="api" title="컨트롤러가 제공하는 항목">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>close()</InlineCode>, <InlineCode>unmount()</InlineCode>: 현재 다이얼로그를 닫거나 DOM에서 제거합니다.
        </li>
        <li>
          <InlineCode>update(next)</InlineCode>: 상태 객체를 교체하거나 함수형 업데이트로 일부 필드를 수정합니다.
        </li>
        <li>
          <InlineCode>setStatus(status)</InlineCode>, <InlineCode>status</InlineCode>: 비동기 진행 상태를 설정하거나 조회합니다.
        </li>
        <li>
          <InlineCode>resolve(payload)</InlineCode>, <InlineCode>reject(reason)</InlineCode>:{' '}
          <InlineCode>openAsync</InlineCode> 호출에서 반환된 Promise를 완료하거나 거부합니다.
        </li>
        <li>
          <InlineCode>options</InlineCode>: <InlineCode>createDialogApi</InlineCode> 등록 시 전달한 옵션 객체.
        </li>
        <li>
          <InlineCode>stack</InlineCode>: <InlineCode>index</InlineCode>와 <InlineCode>size</InlineCode> 정보를 포함한 스택 메타 데이터.
        </li>
        <li>
          <InlineCode>dialog</InlineCode>: 현재 다이얼로그의 ID와 componentKey를 담은 핸들.
        </li>
        <li>
          <InlineCode>getStateFields</InlineCode>, <InlineCode>getStateField</InlineCode>: props와 사용자 정의 상태를 병합해 안전하게 추출합니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="tips" title="팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>getStateFields</InlineCode>로 props와 사용자 정의 상태를 병합하면 안전하게 기본값을
          지정할 수 있습니다.
        </li>
        <li>
          컨트롤러가 제공하는 <InlineCode>options</InlineCode>는 <InlineCode>createDialogApi</InlineCode> 호출 시
          전달한 옵션과 동일합니다. 공통 옵션을 정의해 반복적인 로직을 줄이세요.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="next" title="다음 읽을 거리">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          렌더러 배치와 전역 동작 확장은 <InlineCode>DialogsRenderer</InlineCode> 문서에서 이어집니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
