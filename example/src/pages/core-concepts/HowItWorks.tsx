import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';

export const HowItWorks = () => (
  <DocArticle title="How it Works">
    <p className="lead">
      React Layered Dialog는 세 가지 핵심 요소를 통해 다이얼로그를 효율적으로
      관리합니다.
    </p>

    <Section as="h2" id="dialog-manager" title="1. DialogManager (핵심 엔진)">
      <p>
        라이브러리의 핵심 두뇌입니다. React에 의존하지 않는 순수 TypeScript
        클래스로, 열려있는 모든 다이얼로그의 상태를 배열로 관리합니다.{' '}
        <InlineCode>open</InlineCode>, <InlineCode>close</InlineCode>,{' '}
        <InlineCode>update</InlineCode>와 같은 메서드를 통해 이 배열을
        조작합니다. 이 방식은 React 외부에서 상태를 관리하여 불필요한
        리렌더링을 최소화합니다.
      </p>
    </Section>

    <Section
      as="h2"
      id="state-component-mapping"
      title="2. State & Component Mapping"
    >
      <p>
        <InlineCode>createUseDialogs</InlineCode> 팩토리 함수는{' '}
        <InlineCode>DialogManager</InlineCode>의 상태 배열과 실제 React
        컴포넌트를 연결하는 역할을 합니다. 사용자가 정의한 다이얼로그{' '}
        <InlineCode>type</InlineCode>과 그에 해당하는 컴포넌트를 매핑하여,{' '}
        <InlineCode>DialogManager</InlineCode>가 특정 타입의 다이얼로그를
        열도록 명령하면, 팩토리 함수가 올바른 컴포넌트를 찾아 렌더링할 수
        있도록 준비합니다.
      </p>
    </Section>

    <Section
      as="h2"
      id="dialog-renderer"
      title="3. DialogRenderer (렌더링 레이어)"
    >
      <p>
        <InlineCode>DialogManager</InlineCode>가 관리하는 다이얼로그 상태
        배열을 구독하는 React 컴포넌트입니다. React 18의{' '}
        <InlineCode>useSyncExternalStore</InlineCode> 훅을 사용하여{' '}
        <InlineCode>DialogManager</InlineCode>의 상태 변경을 감지하고, 변경이
        있을 때만 효율적으로 리렌더링을 수행합니다. 이 컴포넌트는 실제
        다이얼로그 컴포넌트들(Alert, Confirm, Modal 등)을 DOM에 렌더링하는
        무대 역할을 합니다.
      </p>
    </Section>

    <div className="not-prose my-6 rounded-lg border bg-muted/30 p-4 text-center">
      <p className="text-lg font-semibold">[데이터 흐름 다이어그램]</p>
      <p className="mt-2 text-sm text-muted-foreground">
        openDialog 호출 → DialogManager 상태 변경 → useSyncExternalStore 감지
        → DialogRenderer 리렌더링
      </p>
    </div>
  </DocArticle>
);