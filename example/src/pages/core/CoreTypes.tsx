import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const baseLayerSnippet = `export interface BaseLayerProps {
  /**
   * 레이어의 쌓임 순서(z-index)입니다.
   * 일반적으로 자동 관리에 맡기는 것을 권장합니다.
   * 다른 라이브러리와의 z-index 충돌 등 특수한 경우에만 직접 지정하세요.
   * 지정하지 않으면 \`baseZIndex\`(기본값 1000)부터 시작하는 값이 자동으로 할당됩니다.
   */
  zIndex?: number;
  /**
   * 레이어 뒤에 깔리는 어두운 배경(dim)을 표시할지 여부입니다.
   * @default true
   */
  dimmed?: boolean;
  /**
   * 오버레이(배경) 클릭 시 레이어를 닫을지 여부입니다.
   * \`useLayerBehavior\` 훅의 \`closeOnOutsideClick\` 옵션을 통해 구현됩니다.
   * @default true
   */
  closeOnOutsideClick?: boolean;
  /**
   * Escape 키를 눌렀을 때 레이어를 닫을지 여부입니다.
   * \`useLayerBehavior\` 훅의 \`closeOnEscape\` 옵션을 통해 구현됩니다.
   * @default true
   */
  dismissable?: boolean;
  /**
   * 레이어가 열렸을 때 배경 스크롤을 막을지 여부입니다. (향후 구현 예정)
   * @default true
   */
  scrollLock?: boolean;
}`;

const baseStateMetaSnippet = `export interface BaseStateMeta {
  id?: string;
  isOpen?: boolean;
}`;

const baseStateSnippet = `export type BaseState = BaseLayerProps & BaseStateMeta;`;

const dialogStateSnippet = `export type DialogState<T> = T &
  BaseLayerProps &
  Required<BaseStateMeta>;`;

const patchSnippet = `const handle = manager.openDialog({
  type: 'alert',
  title: '처음 제목',
});

manager.updateDialog(handle, {
  title: '업데이트된 제목',
  dimmed: false,
});

manager.updateDialog(handle, (prev) => ({
  title: prev.title.toUpperCase(),
}));`;

export const CoreTypes = () => (
  <DocArticle title="코어 타입 가이드">
    <p className="lead">
      <InlineCode>package/src/core/types.ts</InlineCode>에 정의된 공통 타입은
      다이얼로그 상태를 안전하게 설계하고,{' '}
      <InlineCode>useLayerBehavior</InlineCode>와 연결되는 동작 플래그를
      제공합니다. 이 문서는 각 타입의 역할과 기본값을 정리합니다.
    </p>

    <Section as="h2" id="base-layer-props" title="BaseLayerProps">
      <p>
        <InlineCode>BaseLayerProps</InlineCode>는 모든 다이얼로그 컴포넌트가
        공유하는 동작 옵션입니다. 옵션의 기본값은{' '}
        <InlineCode>DialogManager</InlineCode>와 컴포넌트 구현에서 설정해
        두었습니다.
      </p>
      <CodeBlock language="ts" code={baseLayerSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>zIndex</InlineCode>: 지정하지 않으면{' '}
          <InlineCode>baseZIndex</InlineCode>부터 순차 증가합니다.
        </li>
        <li>
          <InlineCode>dimmed</InlineCode>: <InlineCode>true</InlineCode> 시
          오버레이를 그리고 배경 클릭을 막습니다.
        </li>
        <li>
          <InlineCode>closeOnOutsideClick</InlineCode>,{' '}
          <InlineCode>dismissable</InlineCode>:{' '}
          <InlineCode>useLayerBehavior</InlineCode>의{' '}
          <InlineCode>closeOnOutsideClick</InlineCode> /
          <InlineCode>closeOnEscape</InlineCode>에 연결됩니다.
        </li>
        <li>
          <InlineCode>scrollLock</InlineCode>: 향후 배경 스크롤을 잠글 때 사용할
          예약 필드입니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="base-state" title="BaseState와 DialogState">
      <p>
        <InlineCode>BaseStateMeta</InlineCode>는 매니저가 제어하는 메타 필드(
        <InlineCode>id</InlineCode>, <InlineCode>isOpen</InlineCode>)를 정의합니다.
      </p>
      <CodeBlock language="ts" code={baseStateMetaSnippet} />
      <p>
        <InlineCode>BaseState</InlineCode>는{' '}
        <InlineCode>BaseLayerProps</InlineCode>와 메타 필드를 결합한 타입입니다.
        앱 전역 상태 유니온을 선언할 때 <InlineCode>BaseState</InlineCode>를
        확장하면 dim, ESC 옵션처럼 공통 동작을 손쉽게 공유할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={baseStateSnippet} />
      <p>
        <InlineCode>DialogState&lt;T&gt;</InlineCode>는 라이브러리가 내부적으로
        사용하는 최종 상태 형태입니다. <InlineCode>id</InlineCode>와{' '}
        <InlineCode>isOpen</InlineCode>을 필수로 만들고,
        <InlineCode>BaseLayerProps</InlineCode>를 병합하여 z-index, dim, ESC, scroll
        lock 같은 동작 플래그를 일관되게 제공합니다.
      </p>
      <CodeBlock language="ts" code={dialogStateSnippet} />
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          상태 유니온을 <InlineCode>DialogState&lt;T&gt;</InlineCode>로 감싸면
          매니저가 <InlineCode>id</InlineCode>, <InlineCode>isOpen</InlineCode>,
          <InlineCode>zIndex</InlineCode>, <InlineCode>dimmed</InlineCode>,
          <InlineCode>dismissable</InlineCode>, <InlineCode>closeOnOutsideClick</InlineCode>,
          <InlineCode>scrollLock</InlineCode>을 자동으로 병합합니다.
        </li>
        <li>
          컴포넌트 입장에서는 완성된 <InlineCode>{'{ ...state }'}</InlineCode>를
          받을 수 있어 props 정의와 테스트가 단순해집니다.
        </li>
      </ul>
    </Section>

    <Section as="h2" id="patch" title="DialogPatch와 업데이트">
      <p>
        <InlineCode>DialogPatch</InlineCode>는{' '}
        <InlineCode>DialogState</InlineCode>에서 <InlineCode>id</InlineCode>,
        <InlineCode>type</InlineCode>, <InlineCode>isOpen</InlineCode>을 제외한
        부분 상태 타입입니다. <InlineCode>manager.updateDialog</InlineCode>에
        직접 객체를 전달하거나, 이전 상태를 받아 새 패치를 반환하는 함수로
        사용할 수 있습니다.
      </p>
      <CodeBlock language="ts" code={patchSnippet} />
      <p className="text-sm text-muted-foreground">
        패치 함수 내부에서도 <InlineCode>BaseLayerProps</InlineCode>에 포함된
        동작 플래그를 안전하게 변경할 수 있으며, 값 검증이나 파생 로직은
        애플리케이션 수준에서 자유롭게 구현하면 됩니다.
      </p>
    </Section>

    <Section as="h2" id="tips" title="어디에서 활용되나요?">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <InlineCode>DialogRenderer</InlineCode>는 각 다이얼로그의{' '}
          <InlineCode>scrollLock</InlineCode> 플래그를 검사해 배경 스크롤을
          잠글지 판단합니다.
        </li>
        <li>
          <InlineCode>useLayerBehavior</InlineCode>는{' '}
          <InlineCode>dismissable</InlineCode>과{' '}
          <InlineCode>closeOnOutsideClick</InlineCode> 값을 받아 ESC/외부 클릭
          동작을 구성합니다.
        </li>
        <li>
          모든 공개 API에서 <InlineCode>DialogState</InlineCode>를 사용하므로,
          사용자 정의 다이얼로그도 동일한 타입 계약을 따르면 자동으로 안전성이
          보장됩니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
