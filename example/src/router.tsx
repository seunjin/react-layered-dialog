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
import { SyncPatternsPage } from '@/pages/building-dialogs/SyncPatterns';
import RenewalDemoPage from '@/pages/renewal/Renewal';
import { ApiDialogStorePage } from '@/pages/api/DialogStore';
import { ApiCreateDialogApiPage } from '@/pages/api/CreateDialogApi';
import { ApiDefineDialogPage } from '@/pages/api/DefineDialog';
import { ApiDialogsRendererPage } from '@/pages/api/DialogsRenderer';
import { ApiUseDialogControllerPage } from '@/pages/api/UseDialogController';
import { ApiTypesPage } from '@/pages/api/Types';
import { ApiAdvancedStateLifecyclePage } from '@/pages/api/advanced/StateLifecycle';
import { ApiAdvancedZIndexLayeringPage } from '@/pages/api/advanced/ZIndexLayering';
import { ApiAdvancedAsyncStatusPage } from '@/pages/api/advanced/AsyncStatus';
import { ApiAdvancedMultiStoreSSRPage } from '@/pages/api/advanced/MultiStoreSSR';
// Appendix routes removed for now

export const routeConfig = [
  {
    path: 'getting-started',
    title: 'Getting Started',
    children: [
      {
        path: 'introduction',
        element: <GettingStartedIntroduction />,
        name: 'Introduction',
      },
      {
        path: 'quick-start',
        element: <GettingStartedQuickStart />,
        name: 'Quick Start',
      },
    ],
  },
  {
    path: 'fundamentals',
    title: 'Fundamentals',
    children: [
      {
        path: 'architecture',
        element: <FundamentalsArchitecture />,
        name: 'Architecture Overview',
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
    path: 'api',
    title: 'API',
    children: [
      {
        path: 'dialog-store',
        element: <ApiDialogStorePage />,
        name: 'DialogStore',
      },
      {
        path: 'create-dialog-api',
        element: <ApiCreateDialogApiPage />,
        name: 'createDialogApi',
      },
      {
        path: 'define-dialog',
        element: <ApiDefineDialogPage />,
        name: 'defineDialog',
      },
      {
        path: 'dialogs-renderer',
        element: <ApiDialogsRendererPage />,
        name: 'DialogsRenderer',
      },
      {
        path: 'use-dialog-controller',
        element: <ApiUseDialogControllerPage />,
        name: 'useDialogController',
      },
      { path: 'types', element: <ApiTypesPage />, name: 'Types' },
      // 고급
      {
        path: 'advanced/state-lifecycle',
        element: <ApiAdvancedStateLifecyclePage />,
        name: 'State/Lifecycle',
      },
      {
        path: 'advanced/z-index',
        element: <ApiAdvancedZIndexLayeringPage />,
        name: 'zIndex/Layering',
      },
      {
        path: 'advanced/async-status',
        element: <ApiAdvancedAsyncStatusPage />,
        name: 'Async Status',
      },
      {
        path: 'advanced/multi-store-ssr',
        element: <ApiAdvancedMultiStoreSSRPage />,
        name: 'Multi-store/SSR',
      },
      // Appendix removed
    ],
  },

  {
    path: 'building-dialogs',
    title: 'Building Dialogs',
    children: [
      {
        path: 'defining',
        element: <BuildingDefiningDialogsPage />,
        name: 'Defining Types',
      },
      {
        path: 'components',
        element: <ComponentBasicsPage />,
        name: 'Component Basics',
      },
      {
        path: 'sync-patterns',
        element: <SyncPatternsPage />,
        name: 'Sync Patterns',
      },
      {
        path: 'async-patterns',
        element: <AsyncPatternsPage />,
        name: 'Async Patterns',
      },
    ],
  },
  {
    path: 'renewal',
    title: 'Live Demo',
    children: [
      {
        path: 'live-showcase',
        element: <RenewalDemoPage />,
        name: 'Live Showcase',
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
