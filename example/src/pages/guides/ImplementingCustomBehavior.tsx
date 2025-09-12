import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const rendererHookCode = `// src/components/dialogs/DialogRenderer.tsx
import { useDialogs } from '@/lib/dialogs';
import { useEffect } from 'react';

// ...

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();
  const isScrollLocked = dialogs.some((dialog) => dialog.scrollLock);

  // ...
};
`;

const rendererEffectCode = `// src/components/dialogs/DialogRenderer.tsx
// ...

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();
  const isScrollLocked = dialogs.some((dialog) => dialog.scrollLock);

  useEffect(() => {
    if (isScrollLocked) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }

    // 컴포넌트가 언마운트될 때를 대비해 정리(cleanup) 함수를 반환합니다.
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isScrollLocked]);

  // ...
};
`;

const cssCode = `/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body.scroll-locked {
  overflow: hidden;
}
`;

export const ImplementingCustomBehavior = () => (
  <DocArticle title="가이드: 커스텀 동작 구현하기">
    <p className="lead">
      BaseLayerProps의 속성을 활용하여 스크롤 잠금(Scroll Lock)과 같은 커스텀
      동작을 구현하는 방법을 알아봅니다.
    </p>

    <Section as="h2" id="philosophy" title="라이브러리의 설계 철학">
      <p>
        <InlineCode>react-layered-dialog</InlineCode>는 의도적으로 스크롤 잠금,
        포커스 트랩(Focus Trap) 같은 부수 효과(side effects)를 최소한으로
        내장하고 있습니다. 모든 애플리케이션의 DOM 구조와 스타일링 전략이 다르기
        때문에, 라이브러리가 특정 방식을 강제하면 오히려 유연성을 해칠 수 있기
        때문입니다.
      </p>
      <p className="mt-2">
        따라서 <InlineCode>BaseLayerProps</InlineCode>의{' '}
        <InlineCode>scrollLock</InlineCode>, <InlineCode>dismissable</InlineCode>{' '}
        같은 속성은 라이브러리가 직접 처리하는 기능이 아니라, 개발자에게 보내는
        일종의 &quot;제안&quot; 또는 &quot;신호&quot;입니다. 우리는 이 신호를
        받아 우리 프로젝트에 맞는 동작을 직접 구현할 수 있습니다.
      </p>
    </Section>

    <Section as="h2" id="implementing-scroll-lock" title="구현 예제: 스크롤 잠금">
      <p>
        가장 흔한 요구사항 중 하나인 스크롤 잠금을 예제로 구현해 보겠습니다.
        하나 이상의 다이얼로그에 <InlineCode>scrollLock: true</InlineCode> 옵션이
        있을 때 <InlineCode>document.body</InlineCode>의 스크롤을 막는 것이
        목표입니다.
      </p>

      <h3 className="mt-6 font-semibold" id="step-1">
        1단계: 스크롤 잠금 상태 감지하기
      </h3>
      <p>
        모든 다이얼로그가 렌더링되는{' '}
        <InlineCode>DialogRenderer.tsx</InlineCode> 파일에서 현재{' '}
        <InlineCode>scrollLock</InlineCode>이 필요한 다이얼로그가 있는지
        확인합니다. <InlineCode>Array.prototype.some</InlineCode>을 사용하면
        간단하게 구현할 수 있습니다.
      </p>
      <CodeBlock language="tsx" code={rendererHookCode} />

      <h3 className="mt-6 font-semibold" id="step-2">
        2단계: useEffect로 부수 효과 처리하기
      </h3>
      <p>
        감지한 <InlineCode>isScrollLocked</InlineCode> 상태가 변경될 때마다 실제
        DOM에 효과를 적용하기 위해 <InlineCode>useEffect</InlineCode> 훅을
        사용합니다. <InlineCode>isScrollLocked</InlineCode>가{' '}
        <InlineCode>true</InlineCode>이면 body에 특정 클래스(예:{' '}
        <InlineCode>.scroll-locked</InlineCode>)를 추가하고,{' '}
        <InlineCode>false</InlineCode>이면 제거합니다.
      </p>
      <CodeBlock language="tsx" code={rendererEffectCode} />

      <h3 className="mt-6 font-semibold" id="step-3">
        3단계: CSS 스타일 추가하기
      </h3>
      <p>
        마지막으로, <InlineCode>src/index.css</InlineCode>와 같은 전역 CSS 파일에{' '}
        <InlineCode>.scroll-locked</InlineCode> 클래스에 대한 스타일을
        정의합니다.
      </p>
      <CodeBlock language="css" code={cssCode} />
      <Alert className="mt-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>구현 완료!</AlertTitle>
        <AlertDescription>
          이제 <InlineCode>openDialog</InlineCode>를 호출할 때{' '}
          <InlineCode>scrollLock: true</InlineCode> 옵션을 전달하면 다이얼로그가
          열려있는 동안 페이지 스크롤이 자동으로 잠깁니다.
        </AlertDescription>
      </Alert>

      <h3 className="mt-6 font-semibold" id="alternative-method">
        대안: data-* 속성 사용하기
      </h3>
      <p>
        body에 클래스를 추가하는 대신,{' '}
        <a
          href="https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/data-*"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          <InlineCode>data-*</InlineCode> 속성
        </a>
        을 사용하는 것도 좋은 방법입니다. 이 방식은 어떤 이유로 스크롤이
        잠겼는지 DOM에서 더 명확하게 확인할 수 있는 장점이 있습니다.
      </p>
      <CodeBlock
        language="tsx"
        code={`// DialogRenderer.tsx
useEffect(() => {
  document.body.dataset.scrollLock = isScrollLocked ? 'true' : '';
  // isScrollLocked가 false일 때 속성 자체를 제거하고 싶다면 아래와 같이 할 수 있습니다.
  // if (isScrollLocked) {
  //   document.body.dataset.scrollLock = 'true';
  // } else {
  //   delete document.body.dataset.scrollLock;
  // }
}, [isScrollLocked]);

// index.css
body[data-scroll-lock='true'] {
  overflow: hidden;
}
`}
      />
    </Section>

    <Section as="h2" id="next-steps" title="다른 동작으로 확장하기">
      <p>
        여기서 사용한 패턴을 응용하면 다양한 커스텀 동작을 구현할 수 있습니다.
        예를 들어, <InlineCode>dismissable: false</InlineCode>일 때 닫기 버튼을
        숨기거나, 다이얼로그의 <InlineCode>type</InlineCode>에 따라 다른 종류의
        등장/퇴장 애니메이션을 적용하는 등의 확장이 가능합니다.
      </p>
    </Section>
  </DocArticle>
);
