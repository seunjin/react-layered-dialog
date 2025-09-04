import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  return (
    <ShadcnSidebar>
      <SidebarContent className="overflow-auto py-4">
        <SidebarNav className="p-4 pt-0" />
      </SidebarContent>
    </ShadcnSidebar>
  );
}
