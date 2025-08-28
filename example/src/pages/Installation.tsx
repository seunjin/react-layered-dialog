import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Installation = () => (
  <Card>
    <CardHeader>
      <CardTitle>설치</CardTitle>
      <CardDescription>다음 명령어를 사용하여 라이브러리를 설치하세요.</CardDescription>
    </CardHeader>
    <CardContent>
      <pre className="bg-gray-900 text-white p-4 rounded-md">
        <code>pnpm add react-layered-dialog</code>
      </pre>
    </CardContent>
  </Card>
);
