import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { DocLinks } from '@/components/docs/DocLink';
import { Link } from 'react-router-dom';

export const ApiAppendixFAQPage = () => (
  <DocArticle title="부록: FAQ">
    <Section as="h2" id="unmount-timing" title="닫을 때 바로 사라지지 않아요">
      <p>
        <InlineCode>close()</InlineCode>는 <InlineCode>isOpen=false</InlineCode>{' '}
        전환만 수행하고 DOM은 유지합니다. 퇴장 애니메이션 후{' '}
        <InlineCode>unmount()</InlineCode>로 제거하세요. 자세한 내용은{' '}
        <Link to="/api/advanced/state-lifecycle">고급: 상태/수명주기</Link>를
        참조하세요.
      </p>
    </Section>
    <Section as="h2" id="zindex-order" title="z-index가 꼬일 때는?">
      <p>
        {/* &#123; */}
        수동 지정(
        <InlineCode>open(..., {`{zIndex}`})</InlineCode>
        )이 섞인 경우 내부 카운터는 지정값을 반영해 증가합니다. 스택이 비면{' '}
        <InlineCode>baseZIndex</InlineCode>로 리셋됩니다.{' '}
        <Link to="/api/advanced/z-index">고급: zIndex/레이어링</Link> 참조.
      </p>
    </Section>
    <Section as="h2" id="async-flow" title="확인 모달 처리 흐름 권장 방식">
      <p>
        <InlineCode>openAsync</InlineCode>를 사용하고, 내부에서는{' '}
        <InlineCode>resolve</InlineCode>로 결과를 전달하세요. 진행 상태는{' '}
        <InlineCode>status/getStatus/setStatus</InlineCode>로 관리합니다.{' '}
        <Link to="/api/advanced/async-status">고급: 비동기 상태</Link> 참조.
      </p>
    </Section>
    <Section as="h2" id="related" title="관련 문서">
      <DocLinks
        links={[
          { to: '/api/advanced/state-lifecycle', label: 'API(고급) → 상태/수명주기' },
          { to: '/api/advanced/z-index', label: 'API(고급) → zIndex/레이어링' },
          { to: '/fundamentals/dialogs-renderer', label: '핵심 개념 → DialogsRenderer' },
        ]}
      />
    </Section>
  </DocArticle>
);
