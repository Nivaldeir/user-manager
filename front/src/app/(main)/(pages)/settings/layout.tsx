"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SettingsSidebar } from "./_components/settings-sidebar";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const path = usePathname().split("/");
  return (
    <section className="border-l-[1px] border-t-[1px] pb-20 h-screen rounded-tl-3xl border-muted-foreground/20 overflow-scroll flex gap-4 h-c">
      <SettingsSidebar />
      <aside className="flex flex-1">{children}</aside>
    </section>
  );
};

export default Layout;
