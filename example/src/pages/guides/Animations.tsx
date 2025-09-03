import { CodeBlock } from '@/components/docs/CodeBlock';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocArticle } from '@/components/docs/DocArticle';

const rendererCode = `// src/components/dialogs/DialogRenderer.tsx
import { useDialogs } from '@/lib/dialogs';
import { AnimatePresence } from 'motion/react';

export const DialogRenderer = () => {
  const { dialogs } = useDialogs();

  return (
    // AnimatePresence로 dialogs 배열을 감싸면,
    // 컴포넌트가 DOM에서 제거될 때 exit 애니메이션을 적용할 수 있습니다.
    <AnimatePresence>
      {dialogs.map(({ Component, state }) => (
        <Component key={state.id} {...state} />
      ))}
    </AnimatePresence>
  );
};
`;

const componentCode = `// src/components/dialogs/Alert.tsx
import { motion } from 'motion/react';
// ... other imports

export const Alert = ({ title, message, zIndex }: AlertProps) => {
  return (
    <div style={{ zIndex }} className="fixed inset-0 flex items-center justify-center">
      {/* 오버레이 */}
      <motion.div
        className="absolute inset-0 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* 다이얼로그 패널 */}
      <motion.div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {/* ... content ... */}
      </motion.div>
    </div>
  );
};
`;

export const Animations = () => (
  <DocArticle>
    <h1>Animations (with Motion)</h1>
    <p>
      <InlineCode>motion/react</InlineCode>와 같은 애니메이션 라이브러리와
      함께 사용하여 다이얼로그에 부드러운 등장/퇴장 효과를 적용할 수 있습니다.
    </p>

    <p>
      애니메이션을 적용하는 핵심은 <InlineCode>DialogRenderer</InlineCode>에서{' '}
      <InlineCode>AnimatePresence</InlineCode> 컴포넌트를 사용하는 것입니다.
      이를 통해 다이얼로그 컴포넌트가 DOM에서 제거될 때 <InlineCode>exit</InlineCode> 
      애니메이션을 트리거할 수 있습니다.
    </p>
    <CodeBlock language="tsx" code={rendererCode} />

    <p>
      그 다음, 각 다이얼로그 컴포넌트 내부에서 <InlineCode>motion</InlineCode> 
      컴포넌트를 사용하여 <InlineCode>initial</InlineCode>, <InlineCode>animate</InlineCode>, 
      <InlineCode>exit</InlineCode> prop을 정의하여 원하는 애니메이션을 구현합니다.
    </p>
    <CodeBlock language="tsx" code={componentCode} />
  </DocArticle>
);
