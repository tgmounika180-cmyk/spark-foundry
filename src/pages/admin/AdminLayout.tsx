import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Layers, CalendarDays, FileText, Users, Building2, GraduationCap, Image } from "lucide-react";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Programs", url: "/admin/programs", icon: Layers },
  { title: "Events", url: "/admin/events", icon: CalendarDays },
  { title: "Applications", url: "/admin/applications", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Startups", url: "/admin/startups", icon: Building2 },
  { title: "Mentors", url: "/admin/mentors", icon: GraduationCap },
  { title: "Media", url: "/admin/media", icon: Image },
];

export function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Spark Foundry Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive = item.end ? currentPath === item.url : currentPath.startsWith(item.url);
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <NavLink to={item.url} end={item.end}>
                            <item.icon />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="h-12 flex items-center gap-2 border-b border-border px-3">
            <SidebarTrigger />
            <div className="text-sm font-medium">Admin Panel</div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
