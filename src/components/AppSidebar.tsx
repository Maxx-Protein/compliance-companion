import { Home, FileText, ClipboardList, Package, Calculator, CheckCircle2, BarChart3, CreditCard, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "GST Filings", url: "/gst-filings", icon: ClipboardList },
  { title: "Products", url: "/products", icon: Package },
  { title: "Calculator", url: "/calculator", icon: Calculator },
  { title: "Compliance", url: "/compliance", icon: CheckCircle2 },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Subscription", url: "/subscription", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-sidebar-foreground">ComplianceHub</span>
            )}
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
