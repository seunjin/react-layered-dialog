import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Page Components
import { Introduction } from '@/pages/getting-started/Introduction';
import { QuickStart } from '@/pages/getting-started/QuickStart';
import { HowItWorks } from '@/pages/core-concepts/HowItWorks';
import { CreatingADialog } from '@/pages/core-concepts/CreatingADialog';
import { StateVsBehavior } from '@/pages/core-concepts/StateVsBehavior';
import { KeyTypes } from '@/pages/core-concepts/KeyTypes';
import { OpeningAndClosing } from '@/pages/guides/OpeningAndClosing';
import { StateManagement } from '@/pages/guides/StateManagement';
import { NestedDialogs } from '@/pages/guides/NestedDialogs';
import { Animations } from '@/pages/guides/Animations';
import { BuildingACustomComponent } from '@/pages/guides/BuildingACustomComponent';
import { LiveDemos } from '@/pages/examples/LiveDemos';
import { AlertDialog } from '@/pages/examples/AlertDialog';
import { ConfirmDialog } from '@/pages/examples/ConfirmDialog';
import { ContextMenu } from '@/pages/examples/ContextMenu';
import { Drawer } from '@/pages/examples/Drawer';
import { CreateDialogManager } from '@/pages/api-reference/CreateDialogManager';
import { CreateUseDialogs } from '@/pages/api-reference/CreateUseDialogs';
import { UseDialogsHook } from '@/pages/api-reference/UseDialogsHook';
import { UseLayerBehaviorHook } from '@/pages/api-reference/UseLayerBehaviorHook';
import { Accessibility } from '@/pages/advanced/Accessibility';
import { CustomOverlay } from '@/pages/advanced/CustomOverlay';
import { TypeScriptRecipes } from '@/pages/advanced/TypeScriptRecipes';
import { Troubleshooting } from '@/pages/faq/Troubleshooting';

export const routeConfig = [
  {
    path: 'getting-started',
    children: [
      { path: 'introduction', element: <Introduction />, name: 'Introduction' },
      { path: 'quick-start', element: <QuickStart />, name: 'Quick Start' },
    ],
  },
  {
    path: 'core-concepts',
    children: [
      { path: 'how-it-works', element: <HowItWorks />, name: 'How it Works' },
      { path: 'creating-a-dialog', element: <CreatingADialog />, name: 'Creating a Dialog' },
      { path: 'state-vs-behavior', element: <StateVsBehavior />, name: 'State vs. Behavior' },
      { path: 'key-types', element: <KeyTypes />, name: 'Key Types' },
    ],
  },
  {
    path: 'guides',
    children: [
      { path: 'opening-and-closing', element: <OpeningAndClosing />, name: 'Opening & Closing' },
      { path: 'state-management', element: <StateManagement />, name: 'State Management' },
      { path: 'nested-dialogs', element: <NestedDialogs />, name: 'Nested Dialogs' },
      { path: 'animations', element: <Animations />, name: 'Animations' },
      { path: 'building-a-custom-component', element: <BuildingACustomComponent />, name: 'Building a Custom Component' },
    ],
  },
  {
    path: 'examples',
    children: [
      { path: 'live-demos', element: <LiveDemos />, name: 'Live Demos' },
      { path: 'alert-dialog', element: <AlertDialog />, name: 'Alert Dialog' },
      { path: 'confirm-dialog', element: <ConfirmDialog />, name: 'Confirm Dialog' },
      { path: 'context-menu', element: <ContextMenu />, name: 'Context Menu' },
      { path: 'drawer', element: <Drawer />, name: 'Drawer' },
    ],
  },
  {
    path: 'api-reference',
    children: [
      { path: 'create-dialog-manager', element: <CreateDialogManager />, name: 'createDialogManager' },
      { path: 'create-use-dialogs', element: <CreateUseDialogs />, name: 'createUseDialogs' },
      { path: 'use-dialogs-hook', element: <UseDialogsHook />, name: 'useDialogs Hook' },
      { path: 'use-layer-behavior-hook', element: <UseLayerBehaviorHook />, name: 'useLayerBehavior Hook' },
    ],
  },
  {
    path: 'advanced',
    children: [
      { path: 'accessibility', element: <Accessibility />, name: 'Accessibility' },
      { path: 'custom-overlay', element: <CustomOverlay />, name: 'Custom Overlay' },
      { path: 'typescript-recipes', element: <TypeScriptRecipes />, name: 'TypeScript Recipes' },
    ],
  },
  {
    path: 'faq',
    children: [
      { path: 'troubleshooting', element: <Troubleshooting />, name: 'Troubleshooting' },
    ],
  },
];

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        // Redirect from root to the introduction page
        { index: true, element: <Navigate to="/getting-started/introduction" replace /> },
        ...routeConfig.flatMap(section => 
          section.children.map(child => ({
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
