import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Introduction as GettingStartedIntroduction } from '@/pages/getting-started/Introduction';
import { QuickStart as GettingStartedQuickStart } from '@/pages/getting-started/QuickStart';
import { Architecture as FundamentalsArchitecture } from '@/pages/fundamentals/Architecture';
import { DialogStorePage } from '@/pages/fundamentals/DialogStore';
import { CreateDialogApiPage } from '@/pages/fundamentals/CreateDialogApi';
import { UseDialogControllerPage } from '@/pages/fundamentals/UseDialogController';
import { DialogsRendererPage } from '@/pages/fundamentals/DialogsRenderer';
import { DefiningDialogsPage as BuildingDefiningDialogsPage } from '@/pages/building-dialogs/DefiningDialogs';
import { ComponentBasicsPage } from '@/pages/building-dialogs/ComponentBasics';
import { AsyncPatternsPage } from '@/pages/building-dialogs/AsyncPatterns';
import { BehaviorOptionsPage } from '@/pages/building-dialogs/BehaviorOptions';
import RenewalDemoPage from '@/pages/renewal/Renewal';

export const routeConfig = [
  {
    path: 'getting-started',
    title: '시작하기',
    children: [
      {
        path: 'introduction',
        element: <GettingStartedIntroduction />,
        name: '소개',
      },
      {
        path: 'quick-start',
        element: <GettingStartedQuickStart />,
        name: '빠르게 시작하기',
      },
    ],
  },
  {
    path: 'fundamentals',
    title: '핵심 개념',
    children: [
      {
        path: 'architecture',
        element: <FundamentalsArchitecture />,
        name: '아키텍처 개요',
      },
      {
        path: 'dialog-store',
        element: <DialogStorePage />,
        name: 'DialogStore',
      },
      {
        path: 'create-dialog-api',
        element: <CreateDialogApiPage />,
        name: 'createDialogApi',
      },
      {
        path: 'dialogs-renderer',
        element: <DialogsRendererPage />,
        name: 'DialogsRenderer',
      },
      {
        path: 'use-dialog-controller',
        element: <UseDialogControllerPage />,
        name: 'useDialogController',
      },
    ],
  },
  {
    path: 'building-dialogs',
    title: '다이얼로그 구현 가이드',
    children: [
      {
        path: 'defining',
        element: <BuildingDefiningDialogsPage />,
        name: '타입 설계',
      },
      {
        path: 'components',
        element: <ComponentBasicsPage />,
        name: '컴포넌트 기본기',
      },
      {
        path: 'async-patterns',
        element: <AsyncPatternsPage />,
        name: '비동기 패턴',
      },
      {
        path: 'behavior-options',
        element: <BehaviorOptionsPage />,
        name: '옵션 & 동작',
      },
    ],
  },
  {
    path: 'renewal',
    title: '라이브 데모',
    children: [
      {
        path: 'live-showcase',
        element: <RenewalDemoPage />,
        name: '라이브 쇼케이스',
      },
    ],
  },
];

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/getting-started/introduction" replace />,
        },
        ...routeConfig.flatMap((section) =>
          section.children.map((child) => ({
            path: `${section.path}/${child.path}`,
            element: child.element,
          }))
        ),
        {
          path: '*',
          element: <Navigate to="/getting-started/introduction" replace />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
