import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Introduction as GettingStartedIntroduction } from '@/renewalPages/getting-started/Introduction';
import { QuickStart as GettingStartedQuickStart } from '@/renewalPages/getting-started/QuickStart';
import { Architecture as FundamentalsArchitecture } from '@/renewalPages/fundamentals/Architecture';
import { DialogStorePage } from '@/renewalPages/fundamentals/DialogStore';

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
