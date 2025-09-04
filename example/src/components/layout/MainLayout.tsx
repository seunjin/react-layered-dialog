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
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <main className="flex-1 p-4 sm:p-6">
              <div className="mx-auto w-[min(calc(100%-32px),var(--prose-max))]">
                <Outlet />
                <PageNavigation />
              </div>
            </main>
            <Footer />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
