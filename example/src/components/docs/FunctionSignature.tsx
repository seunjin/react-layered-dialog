import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';

interface ParameterItem {
    /** 파라미터명 */
    name: string;
    /** 타입 */
    type: string;
    /** 설명 */
    description: ReactNode;
    /** 선택적 파라미터 여부 */
    optional?: boolean;
}

interface FunctionSignatureProps {
    /** 섹션 ID (앵커용) */
    id: string;
    /** 메서드/함수 이름 */
    title: string;
    /** 함수 전체 시그니처 코드 */
    signature: string;
    /** 함수 설명 */
    description?: ReactNode;
    /** 파라미터 목록 */
    parameters?: ParameterItem[];
    /** 반환 타입 */
    returnType?: string;
    /** 반환값 설명 */
    returnDescription?: ReactNode;
    /** 사용 예제 코드 */
    usage?: string;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * 함수/메서드에 대한 모든 정보(제목, 설명, 시그니처, 상세 사양, 예제)를
 * 하나의 유기적인 카드 블록으로 통합하여 표시하는 컴포넌트.
 */
export function FunctionSignature({
    id,
    title,
    signature,
    description,
    parameters,
    returnType,
    returnDescription,
    usage,
    className,
}: FunctionSignatureProps) {
    // JSDoc 스타일 주석 생성
    const generateJSDoc = () => {
        const lines: string[] = [];

        // description 처리 (ReactNode인 경우 문자열화 시도, 보통 텍스트임)
        if (description) {
            lines.push(String(description));
        }

        if (parameters && parameters.length > 0) {
            if (lines.length > 0) lines.push('');
            parameters.forEach(p => {
                lines.push(`@param ${p.name}${p.optional ? ' (optional)' : ''} - ${p.description}`);
            });
        }

        if (returnType) {
            if (lines.length > 0) lines.push('');
            lines.push(`@returns ${returnDescription || returnType}`);
        }

        if (lines.length === 0) return '';

        return `/**\n * ${lines.join('\n * ')}\n */\n`;
    };

    const fullSignature = `${generateJSDoc()}${signature}`;

    return (
        <div id={id} className={cn('not-prose my-12 group', className)}>
            {/* 상단 타이틀 */}
            <div className="mb-4">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                    <a href={`#${id}`} className="hover:underline decoration-border decoration-2 underline-offset-4">
                        {title}
                    </a>
                </h3>
            </div>

            <div className="overflow-hidden bg-background">
                {/* 메인 시그니처 (JSDoc 포함) */}
                <CodeBlock
                    language="ts"
                    code={fullSignature}
                    className="!my-0 !border-0 !rounded-none !shadow-none"
                />

                {/* 하단: 사용 예제 (Usage) */}
                {usage && (
                    <div className="mt-4">
                        <div className="mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                {'// Usage Example'}
                            </span>
                        </div>
                        <CodeBlock
                            language="ts"
                            code={usage}
                            className="!my-0 !border-0 !rounded-xl !shadow-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
