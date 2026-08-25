import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from 'hisar-ui';
import { CalendarDays, LayoutDashboard, Settings, Stethoscope, Users } from 'lucide-react';

const items = [
    { icon: LayoutDashboard, label: 'Panel', active: true },
    { icon: CalendarDays, label: 'Randevular', active: false },
    { icon: Stethoscope, label: 'Doktorlar', active: false },
    { icon: Users, label: 'Hastalar', active: false },
];

export function AdminSidebar() {
    return (
        <SidebarProvider style={{ minHeight: 460 }}>
            <Sidebar>
                <SidebarHeader>
                    <div style={{ padding: 8, fontWeight: 700, fontSize: 15 }}>Hisar Panel</div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((it) => (
                                    <SidebarMenuItem key={it.label}>
                                        <SidebarMenuButton isActive={it.active}>
                                            <it.icon />
                                            <span>{it.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <Settings />
                                <span>Ayarlar</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    );
}
