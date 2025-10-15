import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BasicUsageDemo } from './BasicUsageDemo';
import { PlainUsageDemo } from './PlainUsageDemo';

/**
 * 애니메이션 유무를 스위치로 토글하며 두 가지 다이얼로그 구현을 비교할 수 있는 데모 컴포넌트입니다.
 * 기본값은 애니메이션이 없는 Plain 버전입니다.
 */
type UsageToggleDemoProps = {
  useMotion?: boolean;
  onToggle?: (checked: boolean) => void;
};

export const UsageToggleDemo = ({ useMotion, onToggle }: UsageToggleDemoProps) => {
  const isControlled = useMotion !== undefined && onToggle !== undefined;
  const [internal, setInternal] = useState(useMotion ?? false);
  const value = isControlled ? (useMotion as boolean) : internal;

  const handleChange = (checked: boolean) => {
    if (isControlled) {
      onToggle!(checked);
    } else {
      setInternal(checked);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="use-motion-toggle"
          checked={value}
          onCheckedChange={handleChange}
        />
        <Label htmlFor="use-motion-toggle" className="text-sm text-muted-foreground">
          {value ? 'Framer Motion 사용' : '순수 렌더링 (기본값)'}
        </Label>
      </div>
      {value ? <BasicUsageDemo /> : <PlainUsageDemo />}
    </div>
  );
};
