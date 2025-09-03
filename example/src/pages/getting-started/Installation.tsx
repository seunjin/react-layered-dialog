import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TypographyH2,
  TypographyP,
} from '@/components/ui/typography';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const Installation = () => (
  <div className="space-y-8">
    <div>
      <TypographyH2>Installation</TypographyH2>
      <TypographyP>
        선호하는 패키지 매니저를 사용하여 라이브러리를 설치하세요.
      </TypographyP>
    </div>

    <Card>
      <CardHeader>
        <CardDescription>
          애니메이션 기능을 사용하려면 <code className="font-mono">framer-motion</code>도 함께 설치해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pnpm">
          <TabsList>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
          </TabsList>
          <TabsContent value="npm">
            <CodeBlock language="bash" code="npm install react-layered-dialog framer-motion" />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock language="bash" code="yarn add react-layered-dialog framer-motion" />
          </TabsContent>
          <TabsContent value="pnpm">
            <CodeBlock language="bash" code="pnpm add react-layered-dialog framer-motion" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
);
