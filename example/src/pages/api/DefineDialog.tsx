import { DocArticle } from '@/components/docs/DocArticle';
import { Section } from '@/components/docs/Section';
import { InlineCode } from '@/components/docs/InlineCode';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocLinks } from '@/components/docs/DocLink';
import { PropertyTable } from '@/components/docs/PropertyTable';
import { DocCallout } from '@/components/docs/DocCallout';
import { FunctionSignature } from '@/components/docs/FunctionSignature';

const signature = `function defineDialog<
  TProps extends Record<string, unknown>,
  TMode extends 'sync' | 'async' = 'sync'
>(
  component: ComponentType<TProps>,
  options?: DefineDialogOptions<TMode>
): DialogDefinition<TProps, TMode>`;

const optionsType = `interface DefineDialogOptions<TMode extends DialogMode = DialogMode> {
  mode?: TMode;          // 'sync' | 'async', 기본값: 'sync'
  displayName?: string;  // React DevTools에 표시될 이름
}`;

const returnType = `interface DialogDefinition<TProps, TMode> {
  mode: TMode;
  render: (input: DialogInput<TProps, DialogControllerContextValue<TProps>>) 
    => DialogRenderFn<TProps>;
}`;

const basicExample = `import { defineDialog } from 'react-layered-dialog';
import { Alert } from './Alert';
import { Confirm } from './Confirm';

// 동기 다이얼로그 정의 (기본)
export const AlertDialog = defineDialog(Alert);

// 비동기 다이얼로그 정의
export const ConfirmDialog = defineDialog(Confirm, {
  mode: 'async',
  displayName: 'ConfirmDialog',
});`;

const registryExample = `import { createDialogApi, DialogStore } from 'react-layered-dialog';
import { AlertDialog, ConfirmDialog } from './definitions';

export const dialog = createDialogApi(new DialogStore(), {
  // defineDialog로 생성한 정의 사용
  alert: AlertDialog,
  confirm: ConfirmDialog,
  
  // 또는 인라인으로 정의
  prompt: defineDialog(Prompt, { mode: 'async' }),
});`;

const displayNameExample = `// displayName 없이
const AlertDef = defineDialog(Alert);
// DevTools: "Alert" 또는 "AlertDefinition"

// displayName 지정
const AlertDef = defineDialog(Alert, { displayName: 'AlertDialog' });
// DevTools: "AlertDialog"

// 컴포넌트의 displayName 사용
Alert.displayName = 'MyAlert';
const AlertDef = defineDialog(Alert);
// DevTools: "MyAlert"`;

const typeInferenceExample = `// Props 타입이 자동 추론됨
interface AlertProps {
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'error';
}

const AlertDef = defineDialog<AlertProps>(Alert);
// 또는 satisfies로 명시
const AlertDef = defineDialog(Alert) satisfies DialogDefinition<AlertProps>;

// 레지스트리에서 사용 시 자동 완성 지원
dialog.alert({ 
  title: 'Hello',  // ✓ 필수
  message: 'World', // ✓ 필수
  severity: 'info', // ✓ 선택
});`;

export const ApiDefineDialogPage = () => (
    <DocArticle title="defineDialog (API Reference)">
        <p className="lead">
            컴포넌트에 모드와 메타 정보를 부여하여 재사용 가능한 다이얼로그 정의를 생성합니다.
            <InlineCode>createDialogApi</InlineCode> 레지스트리에서 사용할 수 있습니다.
        </p>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <FunctionSignature
            id="signature"
            title="defineDialog()"
            signature={signature}
            description="컴포넌트와 옵션을 받아 DialogDefinition을 반환합니다."
            parameters={[
                { name: 'component', type: 'ComponentType<TProps>', description: '다이얼로그로 렌더링할 React 컴포넌트' },
                { name: 'options', type: 'DefineDialogOptions<TMode>', description: '모드, displayName 등 옵션', optional: true },
            ]}
            returnType="DialogDefinition<TProps, TMode>"
            returnDescription="레지스트리에 등록 가능한 정의 객체"
            usage={basicExample}
        />

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="options" title="Options">
            <CodeBlock language="ts" code={optionsType} />
            <PropertyTable
                items={[
                    {
                        name: 'mode',
                        type: "'sync' | 'async'",
                        description: <>
                            동기/비동기 모드 지정.<br />
                            <InlineCode>sync</InlineCode>: open() → 즉시 핸들 반환<br />
                            <InlineCode>async</InlineCode>: openAsync() → Promise 반환
                        </>,
                        defaultValue: "'sync'"
                    },
                    {
                        name: 'displayName',
                        type: 'string',
                        description: 'React DevTools에서 표시될 컴포넌트 이름. 미지정 시 컴포넌트의 displayName 또는 name 사용'
                    },
                ]}
            />
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="return-type" title="Return Type">
            <CodeBlock language="ts" code={returnType} />
            <PropertyTable
                items={[
                    { name: 'mode', type: 'TMode', description: '지정된 모드 (sync/async)', required: true },
                    { name: 'render', type: '(input) => DialogRenderFn', description: '입력을 받아 렌더링 함수를 생성', required: true },
                ]}
            />
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="basic-example" title="Basic Example">
            <CodeBlock language="tsx" code={basicExample} />
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="usage" title="레지스트리에서 사용">
            <CodeBlock language="tsx" code={registryExample} />
            <DocCallout variant="tip" title="객체 형태와의 차이">
                <InlineCode>defineDialog</InlineCode>로 생성한 정의와 객체 형태 <InlineCode>{`{ component, mode }`}</InlineCode>는
                동일하게 취급됩니다. 정의를 여러 곳에서 재사용하거나 외부 모듈로 분리할 때 <InlineCode>defineDialog</InlineCode>가 유용합니다.
            </DocCallout>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="display-name" title="displayName 활용">
            <CodeBlock language="tsx" code={displayNameExample} />
            <p className="mt-2 text-sm text-muted-foreground">
                displayName은 React DevTools 디버깅과 에러 메시지에서 컴포넌트를 식별하는 데 사용됩니다.
            </p>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="type-inference" title="타입 추론">
            <CodeBlock language="tsx" code={typeInferenceExample} />
            <DocCallout variant="info" title="타입 안전성">
                컴포넌트의 props 타입이 자동으로 추론되어 레지스트리 사용 시 IDE 자동완성이 지원됩니다.
                더 명시적인 타입이 필요하면 제네릭 또는 <InlineCode>satisfies</InlineCode>를 사용하세요.
            </DocCallout>
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="behavior" title="동작 보장 사항">
            <PropertyTable
                items={[
                    { name: '기본 모드', type: "'sync'", description: 'mode 미지정 시 동기 모드로 동작' },
                    { name: 'displayName 우선순위', type: 'cascade', description: 'options.displayName > component.displayName > component.name > "DialogDefinition"' },
                    { name: '레지스트리 호환', type: 'normalized', description: 'createDialogApi에서 객체 형태와 동일하게 처리됨' },
                ]}
            />
        </Section>

        {/* ───────────────────────────────────────────────────────────────────── */}
        <Section as="h2" id="related" title="Related">
            <DocLinks
                links={[
                    { to: '/api/create-dialog-api', label: 'API → createDialogApi' },
                    { to: '/api/types', label: 'API → Types (DialogDefinition)' },
                    { to: '/building-dialogs/defining', label: '구현 가이드 → 다이얼로그 타입 설계' },
                ]}
            />
        </Section>
    </DocArticle>
);
