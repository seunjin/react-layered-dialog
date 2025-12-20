import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from './CodeBlock';
import { InlineCode } from './InlineCode';

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
    className?: string;
}

/**
 * 함수 시그니처와 파라미터를 구조화하여 표시하는 문서 컴포넌트.
 * API 레퍼런스에서 함수를 설명할 때 사용.
 */
export function FunctionSignature({
    signature,
    description,
    parameters,
    returnType,
    returnDescription,
    className,
}: FunctionSignatureProps) {
    return (
        <div className={cn('not-prose space-y-4', className)}>
            {/* 함수 시그니처 */}
            <CodeBlock language="ts" code={signature} />

            {/* 설명 */}
            {description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            )}

            {/* 파라미터 */}
            {parameters && parameters.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">파라미터</h4>
                    <dl className="space-y-2">
                        {parameters.map((param) => (
                            <div key={param.name} className="flex flex-col gap-0.5 pl-3 border-l-2 border-muted">
                                <dt className="flex items-center gap-2">
                                    <InlineCode>{param.name}</InlineCode>
                                    <code className="text-xs text-amber-600 dark:text-amber-400">
                                        {param.type}
                                    </code>
                                    {param.optional && (
                                        <span className="text-xs text-muted-foreground">(선택)</span>
                                    )}
                                </dt>
                                <dd className="text-sm text-muted-foreground">{param.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {/* 반환값 */}
            {returnType && (
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">반환값</h4>
                    <div className="pl-3 border-l-2 border-muted">
                        <code className="text-xs text-amber-600 dark:text-amber-400">{returnType}</code>
                        {returnDescription && (
                            <p className="mt-1 text-sm text-muted-foreground">{returnDescription}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
