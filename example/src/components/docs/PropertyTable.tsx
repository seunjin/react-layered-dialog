import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { InlineCode } from './InlineCode';

interface PropertyItem {
    /** 속성명 */
    name: string;
    /** 타입 시그니처 */
    type: string;
    /** 속성 설명 */
    description: ReactNode;
    /** 기본값 (선택) */
    defaultValue?: string;
    /** 필수 여부 */
    required?: boolean;
}

interface PropertyTableProps {
    items: PropertyItem[];
    className?: string;
}

/**
 * 인터페이스 속성을 테이블 형태로 표시하는 컴포넌트.
 * API 문서에서 타입 필드를 상세히 설명할 때 사용.
 */
export function PropertyTable({ items, className }: PropertyTableProps) {
    return (
        <div className={cn('not-prose overflow-x-auto', className)}>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        <th className="text-left py-2 px-3 font-semibold text-foreground">속성</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">타입</th>
                        <th className="text-left py-2 px-3 font-semibold text-foreground">설명</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr
                            key={item.name}
                            className={cn(
                                'border-b border-border/50',
                                idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                            )}
                        >
                            <td className="py-2.5 px-3 align-top">
                                <div className="flex items-center gap-1.5">
                                    <InlineCode>{item.name}</InlineCode>
                                    {item.required && (
                                        <span className="text-xs text-destructive" title="필수">*</span>
                                    )}
                                </div>
                            </td>
                            <td className="py-2.5 px-3 align-top">
                                <code className="text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap">
                                    {item.type}
                                </code>
                            </td>
                            <td className="py-2.5 px-3 align-top">
                                <div className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                    {item.defaultValue !== undefined && (
                                        <span className="block mt-1 text-xs">
                                            기본값: <InlineCode>{item.defaultValue}</InlineCode>
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
