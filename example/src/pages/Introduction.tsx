import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Introduction = () => (
  <Card>
    <CardHeader>
      <CardTitle>소개</CardTitle>
      <CardDescription>React Layered Dialog에 오신 것을 환영합니다.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>이 라이브러리는 복잡하게 중첩되는 다이얼로그(모달, 확인창, 알림창 등)를 손쉽게 관리하기 위해 만들어졌습니다.</p>
    </CardContent>
  </Card>
);
