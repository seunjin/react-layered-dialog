import { DocArticle } from '@/components/docs/DocArticle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: '다이얼로그가 열릴 때 왜 배경 스크롤이 그대로인가요?',
    answer:
      '배경 스크롤 방지(Scroll Lock)는 라이브러리의 핵심 기능이 아닙니다. 이는 각 앱의 구현 방식이 매우 다양하기 때문입니다. `radix-ui-react-dialog`의 접근 방식처럼, 다이얼로그가 열릴 때 `body` 태그에 특정 클래스나 `overflow: hidden` 스타일을 직접 추가하는 방식을 권장합니다.',
  },
  {
    question: '`z-index`를 직접 관리하고 싶습니다. 가능한가요?',
    answer:
      '네, 가능합니다. `openDialog` 함수를 호출할 때 `zIndex` 속성을 직접 전달하면, 라이브러리의 자동 `z-index` 할당을 무시하고 해당 값으로 다이얼로그를 엽니다. 이는 특정 다이얼로그를 다른 UI 요소보다 항상 위에 표시해야 할 때 유용합니다.',
  },
  {
    question: '`DialogRenderer`를 여러 번 렌더링해도 되나요?',
    answer:
      '아니요, 권장하지 않습니다. `DialogRenderer`는 앱의 최상단 (일반적으로 `App.tsx`나 메인 레이아웃)에 **한 번만** 렌더링되어야 합니다. 이 컴포넌트는 모든 다이얼로그가 렌더링되는 중앙 포털 역할을 하므로, 여러 개가 존재하면 예기치 않은 동작이 발생할 수 있습니다.',
  },
  {
    question:
      '애니메이션 라이브러리로 `framer-motion` 대신 `motion/react`를 사용하는 이유가 있나요?',
    answer:
      '예제에서는 번들 크기가 더 작은 `motion/react`를 사용했지만, 이 라이브러리는 특정 애니메이션 라이브러리에 종속되지 않습니다. `framer-motion`, `react-spring`, 또는 다른 어떤 라이브러리의 `AnimatePresence` (또는 유사 기능)와도 함께 사용할 수 있습니다. 핵심은 `DialogRenderer` 내부에서 `dialogs` 배열을 매핑할 때 애니메이션 존재(presence) 컴포넌트로 감싸주는 것입니다.',
  },
];

export const Troubleshooting = () => (
  <DocArticle title="FAQ / Troubleshooting">
    <p className="lead">자주 묻는 질문과 일반적인 문제 해결 방법입니다.</p>
    <div className="not-prose">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: item.answer.replace(
                    /`([^`]+)`/g,
                    '<code class="font-mono text-sm rounded bg-muted px-1 py-0.5">$&</code>'
                  ),
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </DocArticle>
);
