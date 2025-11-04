import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

import { Introduction } from '@/pages/getting-started/Introduction';
import { QuickStart } from '@/pages/getting-started/QuickStart';
import { Architecture } from '@/pages/core/Architecture';
import { DefiningDialogs } from '@/pages/core/DefiningDialogs';
import { CoreTypes } from '@/pages/core/CoreTypes';
import { OpeningDialogs } from '@/pages/guides/OpeningDialogs';
import { UpdatingDialogs } from '@/pages/guides/UpdatingDialogs';
import { ControllerPatterns } from '@/pages/guides/ControllerPatterns';
import { CreateDialogManager } from '@/pages/api/CreateDialogManager';
import { CreateUseDialogs } from '@/pages/api/CreateUseDialogs';
import { DialogManagerApi } from '@/pages/api/DialogManagerApi';
import { ControllerRenderer } from '@/pages/api/ControllerRenderer';
import { LiveShowcase } from '@/pages/examples/LiveShowcase';
import Renewal from './pages/renewal/Renewal';

export const routeConfig = [
  {
    path: 'getting-started',
    title: 'Getting Started',
    children: [
      { path: 'introduction', element: <Introduction />, name: '소개' },
      { path: 'quick-start', element: <QuickStart />, name: 'Quick Start' },
    ],
  },
  {
    path: 'core',
    title: 'Core',
    children: [
      {
        path: 'architecture',
        element: <Architecture />,
        name: '코어 아키텍처',
      },
      {
        path: 'defining-dialogs',
        element: <DefiningDialogs />,
        name: '다이얼로그 타입 설계',
      },
      { path: 'core-types', element: <CoreTypes />, name: '코어 타입 가이드' },
    ],
  },
  {
    path: 'guides',
    title: 'Guides',
    children: [
      {
        path: 'opening-dialogs',
        element: <OpeningDialogs />,
        name: '다이얼로그 열기',
      },
      {
        path: 'updating-dialogs',
        element: <UpdatingDialogs />,
        name: '상태 업데이트',
      },
      {
        path: 'controller-patterns',
        element: <ControllerPatterns />,
        name: '컨트롤러 패턴',
      },
    ],
  },
  {
    path: 'api',
    title: 'API',
    children: [
      {
        path: 'dialog-store',
        element: <CreateDialogManager />,
        name: 'DialogStore',
      },
      {
        path: 'create-dialog-api',
        element: <CreateUseDialogs />,
        name: 'createDialogApi',
      },
      {
        path: 'dialog-manager',
        element: <DialogManagerApi />,
        name: 'DialogManager',
      },
      {
        path: 'controller-renderer',
        element: <ControllerRenderer />,
        name: 'useDialogController & DialogsRenderer',
      },
    ],
  },
  {
    path: 'examples',
    title: 'Examples',
    children: [
      {
        path: 'live-showcase',
        element: <LiveShowcase />,
        name: 'Live Showcase',
      },
    ],
  },
  {
    path: 'renewal',
    title: 'Renewal',
    children: [{ path: 'renewal', element: <Renewal />, name: 'Renewal' }],
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
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
