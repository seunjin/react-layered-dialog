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
            <div className="flex flex-1 flex-col  ">
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
