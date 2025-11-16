import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { Link } from 'react-router-dom';

const rules = `// z-index 규칙 요약
// - 기본 baseZIndex(기본값 1000)에서 시작, open 시 1씩 증가
// - options.zIndex로 직접 지정하면 nextZIndex는 Math.max(next, 지정값+1)로 보정
// - 모든 엔트리 제거 시 nextZIndex는 baseZIndex로 리셋

const store = new DialogStore({ baseZIndex: 1200 });
const a = store.open(() => <A />);        // zIndex 1200
const b = store.open(() => <B />);        // zIndex 1201
const c = store.open(() => <C />, { zIndex: 1300 }); // zIndex 1300, next는 ≥ 1301
store.unmountAll();                        // nextZIndex → 1200로 초기화`;

export const ApiAdvancedZIndexLayeringPage = () => (
  <DocArticle title="고급: zIndex/레이어링">
    <p className="lead">
      레이어 우선순위는 스토어에서 자동 계산하지만, 필요 시 옵션으로 정밀
      제어합니다.
    </p>

    <Section as="h2" id="definition" title="정의/시그니처">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>new DialogStore({`{ baseZIndex }`})</InlineCode>: 시작
          값을 설정.
        </li>
        <li>
          <InlineCode>open(..., {`{zIndex}`})</InlineCode>: 직접 지정(증분
          보정됨).
        </li>
      </ul>
    </Section>

    <Section as="h2" id="guarantees" title="동작 보증">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>직접 지정 시 다음 증가 값은 지정값+1 이상으로 유지됩니다.</li>
        <li>
          스택이 비면 카운터는 <InlineCode>baseZIndex</InlineCode>로
          초기화됩니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="example" title="간단 예시">
      <CodeBlock language="ts" code={rules} />
    </Section>

    <Section as="h2" id="notes" title="주의점">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          상세 동작은 <Link to="/api/dialog-store">API → DialogStore</Link> 보증
          섹션을 참고하세요.
        </li>
      </ul>
    </Section>
    <Section as="h2" id="related" title="관련 문서">
      <DocLinks
        links={[
          { to: '/fundamentals/dialog-store', label: '핵심 개념 → DialogStore' },
          { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
        ]}
      />
    </Section>
  </DocArticle>
);
