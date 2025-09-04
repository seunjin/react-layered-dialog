import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { PageNavigation } from './PageNavigation';
import { Footer } from './Footer';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <SidebarProvider>
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
