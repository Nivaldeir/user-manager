"use client";

import {
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavLink,
} from "@/components/global/side-bar";
import { usePathname } from "next/navigation";

export function SettingsSidebar() {
  const pathnname = usePathname();
  const isActive = (path: string) => {
    return path === pathnname;
  };
  return (
    <aside className="h-full mx-auto flex items-center">
      <DashboardSidebarNav>
        <DashboardSidebarMain>
          <DashboardSidebarNavLink
            href="/settings/permissions"
            active={isActive("/settings/permissions")}
          >
            Permissões
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/settings/roles"
            active={isActive("/settings/roles")}
          >
            Cargos
          </DashboardSidebarNavLink>
        </DashboardSidebarMain>
      </DashboardSidebarNav>
    </aside>
  );
}
