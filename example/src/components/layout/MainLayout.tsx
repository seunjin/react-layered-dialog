import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageNavigation } from './PageNavigation';
import { Footer } from './Footer';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { ScrollToTop } from '../ScrollToTop';

export function MainLayout() {
  return (
    <SidebarProvider>
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only absolute left-4 top-4 z-50 rounded-md bg-background px-4 py-2 font-semibold text-foreground ring-2 ring-ring ring-offset-2 ring-offset-background focus:not-sr-only"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <SidebarInset className="flex flex-1 flex-col min-w-0">
            <div className="grid grid-rows-[1fr_auto] h-full mx-auto min-w-0 w-full">
              <Outlet />
              <PageNavigation />
            </div>
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
