import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';

const apiShape = `type BaseDialogApi = {
  store: DialogStore;
  open: DialogStore['open'];
  openAsync: DialogStore['openAsync'];
  close: DialogStore['close'];
  unmount: DialogStore['unmount'];
  closeAll: DialogStore['closeAll'];
  unmountAll: DialogStore['unmountAll'];
  update: DialogStore['updateState'];
};

type DialogApi<TRegistry> = BaseDialogApi & {
  [K in keyof TRegistry]: DialogMethodFromDefinition<TRegistry[K]>;
};`;

const example = `const dialog = createDialogApi(dialogStore, {
  alert: { component: Alert },          // dialog.alert(props, options?)
  confirm: { component: Confirm, mode: 'async' }, // dialog.confirm(props | factory, options?)
});

dialog.open((controller) => (
  <ToastDialog title="자동 닫기" onClose={controller.unmount} />
));

const result = await dialog.confirm((controller) => ({
  title: '삭제하시겠어요?',
  message: '이 작업은 되돌릴 수 없습니다.',
  onConfirm: () => controller.resolve?.({ ok: true }),
  onCancel: () => controller.resolve?.({ ok: false }),
}));

if (result.ok) {
  result.setStatus('loading');
  await api.deleteItem();
  result.update({ step: 'done' });
  result.close();
  result.unmount();
}`;

export const DialogManagerApi = () => (
  <DocArticle title="DialogApi 메서드">
    <p className="lead">
      <InlineCode>createDialogApi</InlineCode>는 스토어 조작 메서드와 레지스트리 기반
      헬퍼를 하나의 객체로 반환합니다. 기본 메서드는 언제나 동일하고, 레지스트리에
      추가한 키마다 <InlineCode>dialog.alert</InlineCode>처럼 타입이 특정된 함수가
      생성됩니다.
    </p>

    <Section as="h2" id="shape" title="타입 개요">
      <CodeBlock language="ts" code={apiShape} />
      <p className="mt-2 text-sm text-muted-foreground">
        반환 객체는 스토어 인스턴스를 그대로 노출하므로 필요하면 저수준 메서드에
        직접 접근할 수도 있습니다.
      </p>
    </Section>

    <Section as="h2" id="usage" title="응용 예시">
      <CodeBlock language="ts" code={example} />
      <p className="mt-2 text-sm text-muted-foreground">
        레지스트리가 <InlineCode>{'{ confirm: { component, mode: \'async\' } }'}</InlineCode>처럼
        선언되면 <InlineCode>dialog.confirm</InlineCode>은 자동으로 <InlineCode>Promise</InlineCode>를
        반환합니다. 비동기 결과 객체에는 <InlineCode>close</InlineCode>,
        <InlineCode>unmount</InlineCode>, <InlineCode>update</InlineCode>,
        <InlineCode>setStatus</InlineCode> 등이 포함된다는 점에 주의하세요.
      </p>
    </Section>

    <Section as="h2" id="tips" title="활용 팁">
      <ul className="ml-6 list-disc space-y-2 text-sm text-muted-foreground">
        <li>
          <b>헬퍼 재노출</b>: <InlineCode>openDialog</InlineCode>처럼 자주 사용하는 메서드는 별도로 export해 두면
          테스트와 목킹이 쉬워집니다.
        </li>
        <li>
          <b>컨트롤러 패턴</b>: <InlineCode>open</InlineCode>/<InlineCode>openAsync</InlineCode> 모두
          첫 번째 인자로 렌더러 함수를 받을 수 있습니다. 컨트롤러에서 바로
          <InlineCode>close</InlineCode>, <InlineCode>update</InlineCode>를 호출하면 복잡한 상호작용을
          컴포넌트 외부로 노출하지 않아도 됩니다.
        </li>
        <li>
          <b>테스트</b>: 테스트 환경에서는 <InlineCode>dialog.store.getSnapshot()</InlineCode>을 통해
          현재 열린 다이얼로그를 바로 단언(assert)할 수 있습니다.
        </li>
      </ul>
    </Section>
  </DocArticle>
);
