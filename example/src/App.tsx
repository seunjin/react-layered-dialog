import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDialogs } from '@/lib/dialogs';
import { DialogRenderer } from '@/components/dialogs/DialogRenderer';
import { MainLayout } from '@/components/layout/MainLayout';

// Getting Started
import { Introduction } from '@/pages/getting-started/Introduction';
import { QuickStart } from '@/pages/getting-started/QuickStart';

// Core Concepts
import { HowItWorks } from '@/pages/core-concepts/HowItWorks';
import { CreatingADialog } from '@/pages/core-concepts/CreatingADialog';
import { StateVsBehavior } from '@/pages/core-concepts/StateVsBehavior';
import { KeyTypes } from '@/pages/core-concepts/KeyTypes';

// Guides
import { OpeningAndClosing } from '@/pages/guides/OpeningAndClosing';
import { NestedDialogs } from '@/pages/guides/NestedDialogs';
import { StateManagement } from '@/pages/guides/StateManagement';
import { Animations } from '@/pages/guides/Animations';
import { BuildingACustomComponent } from '@/pages/guides/BuildingACustomComponent';

// Advanced
import { Accessibility } from '@/pages/advanced/Accessibility';
import { CustomOverlay } from '@/pages/advanced/CustomOverlay';
import { TypeScriptRecipes } from '@/pages/advanced/TypeScriptRecipes';

// Examples
import { LiveDemos } from '@/pages/examples/LiveDemos';
import { AlertDialog } from '@/pages/examples/AlertDialog';
import { ConfirmDialog } from '@/pages/examples/ConfirmDialog';
import { Drawer } from '@/pages/examples/Drawer';
import { ContextMenu } from '@/pages/examples/ContextMenu';

// API Reference
import { CreateDialogManager } from '@/pages/api-reference/CreateDialogManager';
import { CreateUseDialogs } from '@/pages/api-reference/CreateUseDialogs';
import { UseDialogsHook } from '@/pages/api-reference/UseDialogsHook';
import { UseLayerBehaviorHook } from '@/pages/api-reference/UseLayerBehaviorHook';

// FAQ
import { Troubleshooting } from '@/pages/faq/Troubleshooting';

function App() {
  const { dialogs } = useDialogs();

  useEffect(() => {
    console.log(
      '%c[React Layered Dialog] %cState Changed:',
      'color: #7c3aed; font-weight: bold;',
      'color: inherit;',
      dialogs
    );
  }, [dialogs]);

  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/getting-started/introduction" />} />
          
          {/* Getting Started */}
          <Route path="/getting-started/introduction" element={<Introduction />} />
          <Route path="/getting-started/quick-start" element={<QuickStart />} />

          {/* Core Concepts */}
          <Route path="/core-concepts/how-it-works" element={<HowItWorks />} />
          <Route path="/core-concepts/creating-a-dialog" element={<CreatingADialog />} />
          <Route path="/core-concepts/state-vs-behavior" element={<StateVsBehavior />} />
          <Route path="/core-concepts/key-types" element={<KeyTypes />} />

          {/* Guides */}
          <Route path="/guides/opening-and-closing" element={<OpeningAndClosing />} />
          <Route path="/guides/nested-dialogs" element={<NestedDialogs />} />
          <Route path="/guides/state-management" element={<StateManagement />} />
          <Route path="/guides/animations" element={<Animations />} />
          <Route path="/guides/building-a-custom-component" element={<BuildingACustomComponent />} />

          {/* Advanced */}
          <Route path="/advanced/accessibility" element={<Accessibility />} />
          <Route path="/advanced/custom-overlay" element={<CustomOverlay />} />
          <Route path="/advanced/typescript-recipes" element={<TypeScriptRecipes />} />

          {/* Examples */}
          <Route path="/examples/live-demos" element={<LiveDemos />} />
          <Route path="/examples/alert-dialog" element={<AlertDialog />} />
          <Route path="/examples/confirm-dialog" element={<ConfirmDialog />} />
          <Route path="/examples/drawer" element={<Drawer />} />
          <Route path="/examples/context-menu" element={<ContextMenu />} />

          {/* API Reference */}
          <Route path="/api/create-dialog-manager" element={<CreateDialogManager />} />
          <Route path="/api/create-use-dialogs" element={<CreateUseDialogs />} />
          <Route path="/api/use-dialogs-hook" element={<UseDialogsHook />} />
          <Route path="/api/use-layer-behavior-hook" element={<UseLayerBehaviorHook />} />

          {/* FAQ */}
          <Route path="/faq/troubleshooting" element={<Troubleshooting />} />

        </Routes>
      </MainLayout>

      <DialogRenderer dialogs={dialogs} />
    </>
  );
}

export default App;