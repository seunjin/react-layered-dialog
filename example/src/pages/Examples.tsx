import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';

export const Examples = () => (
  <div className="space-y-8">
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>개발자 콘솔을 확인하세요!</AlertTitle>
      <AlertDescription>
        F12를 눌러 개발자 콘솔을 열면, 모든 다이얼로그 상태 변화가 실시간으로 기록되는 것을 확인할 수 있습니다.
      </AlertDescription>
    </Alert>

    <BasicUsageDemo />
    <AdvancedFeaturesDemo />
    <AsyncHandlingDemo />
  </div>
);