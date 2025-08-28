import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicUsageDemo } from '@/components/demos/BasicUsageDemo';
import { AdvancedFeaturesDemo } from '@/components/demos/AdvancedFeaturesDemo';
import { AsyncHandlingDemo } from '@/components/demos/AsyncHandlingDemo';

export const Examples = () => (
  <Tabs defaultValue="basic">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="basic">기본 사용법</TabsTrigger>
      <TabsTrigger value="advanced">고급 기능</TabsTrigger>
      <TabsTrigger value="async">비동기 처리</TabsTrigger>
    </TabsList>
    <TabsContent value="basic">
      <BasicUsageDemo />
    </TabsContent>
    <TabsContent value="advanced">
      <AdvancedFeaturesDemo />
    </TabsContent>
    <TabsContent value="async">
      <AsyncHandlingDemo />
    </TabsContent>
  </Tabs>
);
