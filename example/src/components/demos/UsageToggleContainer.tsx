import { useState } from 'react';
import { UsageToggleDemo } from './UsageToggleDemo';
import plainUsageCode from '@/components/demos/PlainUsageDemo.tsx?raw';
import motionUsageCode from '@/components/demos/BasicUsageDemo.tsx?raw';
import { DemoCard } from '@/components/docs/DemoCard';

export const UsageToggleContainer = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const [useMotion, setUseMotion] = useState(false);
  const activeVariant = useMotion ? 'motion' : 'plain';

  return (
    <DemoCard
      title={title}
      description={description}
      codeVariants={[
        { id: 'plain', code: plainUsageCode, label: 'Plain 구현' },
        { id: 'motion', code: motionUsageCode, label: 'Motion 구현' },
      ]}
      activeVariantId={activeVariant}
    >
      <UsageToggleDemo useMotion={useMotion} onToggle={setUseMotion} />
    </DemoCard>
  );
};
