import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

import { Introduction } from '@/pages/getting-started/Introduction';
import { QuickStart } from '@/pages/getting-started/QuickStart';
import { Architecture } from '@/pages/core/Architecture';
import { DefiningDialogs } from '@/pages/core/DefiningDialogs';
import { OpeningDialogs } from '@/pages/guides/OpeningDialogs';
import { UpdatingDialogs } from '@/pages/guides/UpdatingDialogs';
import { LayerBehaviorAddon } from '@/pages/guides/LayerBehaviorAddon';
import { CreateDialogManager } from '@/pages/api/CreateDialogManager';
import { CreateUseDialogs } from '@/pages/api/CreateUseDialogs';
import { DialogManagerApi } from '@/pages/api/DialogManagerApi';
import { UseLayerBehavior } from '@/pages/api/UseLayerBehavior';
import { LiveShowcase } from '@/pages/examples/LiveShowcase';

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
      { path: 'architecture', element: <Architecture />, name: '코어 아키텍처' },
      { path: 'defining-dialogs', element: <DefiningDialogs />, name: '다이얼로그 타입 설계' },
    ],
  },
  {
    path: 'guides',
    title: 'Guides',
    children: [
      { path: 'opening-dialogs', element: <OpeningDialogs />, name: '다이얼로그 열기' },
      { path: 'updating-dialogs', element: <UpdatingDialogs />, name: '상태 업데이트' },
      { path: 'layer-behavior', element: <LayerBehaviorAddon />, name: 'useLayerBehavior 활용' },
    ],
  },
  {
    path: 'api',
    title: 'API',
    children: [
      { path: 'create-dialog-manager', element: <CreateDialogManager />, name: 'createDialogManager' },
      { path: 'create-use-dialogs', element: <CreateUseDialogs />, name: 'createUseDialogs' },
      { path: 'dialog-manager', element: <DialogManagerApi />, name: 'DialogManager' },
      { path: 'use-layer-behavior', element: <UseLayerBehavior />, name: 'useLayerBehavior' },
    ],
  },
  {
    path: 'examples',
    title: 'Examples',
    children: [
      { path: 'live-showcase', element: <LiveShowcase />, name: 'Live Showcase' },
    ],
  },
];

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="/getting-started/introduction" replace /> },
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
