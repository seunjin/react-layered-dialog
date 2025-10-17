import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DemoCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  code?: string;
  codeVariants?: {
    id: string;
    label?: string;
    code: string;
    language?: string;
  }[];
  language?: string;
  className?: string;
  actions?: ReactNode;
  activeVariantId?: string;
  onVariantChange?: (id: string) => void;
};

/**
 * 데모 컴포넌트를 문서 안에서 일관된 스타일로 보여주기 위한 카드 컴포넌트입니다.
 * 실제 인터랙티브 데모와, 필요 시 복사 가능한 코드 블록을 함께 렌더링합니다.
 */
export const DemoCard = ({
  title,
  description,
  children,
  code,
  codeVariants,
  language = 'tsx',
  className,
  actions,
  activeVariantId,
  onVariantChange,
}: DemoCardProps) => {
  const hasVariants = codeVariants && codeVariants.length > 0;
  const isControlled = hasVariants && activeVariantId !== undefined;
  const [internalVariantId, setInternalVariantId] = useState(
    hasVariants ? codeVariants![0].id : undefined
  );

  const currentVariantId = isControlled ? activeVariantId : internalVariantId;

  const currentVariant = hasVariants
    ? (codeVariants!.find((variant) => variant.id === currentVariantId) ??
      codeVariants![0])
    : undefined;

  return (
    <Card className={cn('not-prose border-border bg-card', className)}>
      <CardHeader className="space-y-2">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground break-words">
            {description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-dashed border-border bg-background/60 p-4">
          {children}
        </div>
        {hasVariants ? (
          isControlled ? (
            <CodeBlock
              code={(currentVariant ?? codeVariants![0]).code.trim()}
              language={
                (currentVariant ?? codeVariants![0]).language ?? language
              }
            />
          ) : (
            <Tabs
              value={currentVariantId ?? codeVariants![0].id}
              onValueChange={(value) => {
                setInternalVariantId(value);
                onVariantChange?.(value);
              }}
            >
              <TabsList className="w-full justify-start overflow-x-auto">
                {codeVariants!.map((variant) => (
                  <TabsTrigger key={variant.id} value={variant.id}>
                    {variant.label ?? variant.id}
                  </TabsTrigger>
                ))}
              </TabsList>
              {codeVariants!.map((variant) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <CodeBlock
                    code={variant.code.trim()}
                    language={variant.language ?? language}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )
        ) : code ? (
          <CodeBlock code={code.trim()} language={language} />
        ) : null}
      </CardContent>
      {actions ? (
        <CardFooter className="flex flex-wrap gap-2">{actions}</CardFooter>
      ) : null}
    </Card>
  );
};
