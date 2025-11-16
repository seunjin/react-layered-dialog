import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Link } from 'react-router-dom';

const controllerSignature = `function useDialogController<
  TProps extends Record<string, unknown> = Record<string, unknown>
>(): DialogControllerContextValue<TProps>;`;

const controllerUsage = `import { useDialogController } from 'react-layered-dialog';

type AlertDialogProps = {
  title: string;
  message: string;
};

export function Alert(props: AlertDialogProps) {
  const controller = useDialogController<AlertDialogProps>();
  const { close, unmount, update, stack, zIndex, getStateFields } = controller;

  const handleConfirm = () => {
    close();
    unmount();
  };

  const isTopMost = stack.index === stack.size - 1;
  const { title, message } = getStateFields({ title: props.title, message: props.message });

  return (
    <div role="alertdialog" aria-modal="true" data-topmost={isTopMost} style={{ zIndex }}>
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={handleConfirm}>확인</button>
    </div>
  );
}`;

const exitAnimationExample = `export function Alert(props: AlertDialogProps) {
  const { isOpen, close, unmount, zIndex } = useDialogController<AlertDialogProps>();

  // 예: 상태 기반 퇴장 이후 정리. 실제 타이밍은 프로젝트 정책에 맞춰 결정하세요.
  useEffect(() => {
    if (!isOpen) {
      const id = setTimeout(() => unmount(), 200);
      return () => clearTimeout(id);
    }
  }, [isOpen, unmount]);

  return (
    <div className={isOpen ? 'animate-in' : 'animate-out'} style={{ zIndex }}>
      {/* ...content... */}
      <button onClick={close}>닫기</button>
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
          비동기 다이얼로그에서는 <InlineCode>setStatus</InlineCode>, <InlineCode>getStatus</InlineCode>,{' '}
          <InlineCode>resolve</InlineCode>, <InlineCode>reject</InlineCode>를 활용해 로딩 → 완료 단계 전환을 일관되게 관리할 수 있습니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="api" title="컨트롤러가 제공하는 항목">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>close()</InlineCode>: 현재 다이얼로그의 <InlineCode>isOpen</InlineCode>을 <InlineCode>false</InlineCode>로 바꿉니다.
          DOM에는 남아 있으므로 퇴장 애니메이션을 실행시키기에 적합합니다.
        </li>
        <li>
          <InlineCode>unmount()</InlineCode>: 현재 다이얼로그를 스택(배열)에서 즉시 제거합니다. 퇴장 애니메이션을
          사용한다면 <InlineCode>close()</InlineCode>로 상태 전환 후, 프로젝트 정책에 맞는 시점에 호출해 DOM에서
          제거하세요.
        </li>
        <li>
          <InlineCode>closeAll()</InlineCode>: 열린 모든 다이얼로그의 <InlineCode>isOpen</InlineCode>을 일괄로 <InlineCode>false</InlineCode>로 바꿉니다.
          각 패널이 자체 퇴장 애니메이션을 수행할 수 있도록 DOM은 유지됩니다.
        </li>
        <li>
          <InlineCode>unmountAll()</InlineCode>: 모든 다이얼로그를 즉시 스택에서 제거합니다. 애니메이션을 기다리지 않고 정리할 때 사용합니다.
        </li>
        <li>
          <InlineCode>update(next)</InlineCode>: 상태 객체를 교체하거나 함수형 업데이트로 일부 필드를 수정합니다.
        </li>
        <li>
          <InlineCode>setStatus(status)</InlineCode>, <InlineCode>getStatus()</InlineCode>, <InlineCode>status</InlineCode>: 비동기 진행 상태를 설정하거나 조회합니다.
        </li>
        <li>
          <InlineCode>resolve(payload)</InlineCode>, <InlineCode>reject(reason)</InlineCode>:{' '}
          <InlineCode>openAsync</InlineCode> 호출에서 반환된 Promise를 완료하거나 거부합니다.
        </li>
        
        <li>
          <InlineCode>stack</InlineCode>: <InlineCode>index</InlineCode>와 <InlineCode>size</InlineCode> 정보를 포함한 스택 메타 데이터.
        </li>
        <li>
          <InlineCode>handle</InlineCode>: 현재 다이얼로그의 ID와 componentKey를 담은 핸들.
        </li>
        <li>
          <InlineCode>getStateFields</InlineCode>, <InlineCode>getStateField</InlineCode>: props와 사용자 정의 상태를 병합해 안전하게 추출합니다.
        </li>
        <li>
          <InlineCode>zIndex</InlineCode>, <InlineCode>isOpen</InlineCode>, <InlineCode>state</InlineCode>: 스타일 제어나 렌더 조건 분기에 활용할 수 있는 메타와 상태입니다.
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
          <InlineCode>zIndex</InlineCode>를 활용해 레이어 우선순위를 스타일에서 직접 제어하세요.
        </li>
      </ul>
      <p className="mt-2 text-sm text-muted-foreground">
        퇴장 애니메이션 패턴: 먼저 <InlineCode>close()</InlineCode>로 <InlineCode>isOpen=false</InlineCode>를 설정해
        CSS 퇴장을 트리거하고, 애니메이션 종료 시점에 <InlineCode>unmount()</InlineCode>로 정리합니다.
      </p>
      <CodeBlock language="tsx" code={exitAnimationExample} />
    </Section>

    {/* 다음 읽을 거리 섹션 제거: 문서 흐름 간소화 */}
    <Section as="h2" id="api-links" title="API 문서">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          자세한 시그니처는 <Link to="/api/use-dialog-controller">API → useDialogController</Link>와{' '}
          <Link to="/api/types">API → 타입 모음</Link>을 참조하세요.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
