import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';

export const ApiAppendixChangelogPage = () => (
  <DocArticle title="Appendix: Changelog/Breaking Notes">
    <p className="lead">Summary of major changes and breaking points. (Optional)</p>
    <Section as="h2" id="notes" title="Notes">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          라이브러리 버전 업데이트 시 <InlineCode>DialogStore</InlineCode>, <InlineCode>DialogsRenderer</InlineCode>,
          <InlineCode>useDialogController</InlineCode>의 시그니처 변경 여부를 우선 확인하세요.
        </li>
        <li>
          예제 앱/문서의 코드 블록은 실제 타입 서명과 동기화하는 것을 권장합니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
