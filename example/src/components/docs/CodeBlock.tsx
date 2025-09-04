'use client';

import { useState, type FC } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Check, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({
  code,
  language,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code to clipboard:', error);
    }
  };

  return (
    <div className={cn('relative rounded-md bg-[#1e1e1e]', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/10 hover:text-white"
        onClick={handleCopy}
      >
        {isCopied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: 'transparent',
          borderRadius: '0.375rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
