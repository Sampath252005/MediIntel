"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  BotMessageSquare,
  HeartPulse,
  LayoutDashboard,
  Loader2,
  Pill,
  Scan,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/symptom-checker", icon: HeartPulse, label: "Symptom Checker" },
    { href: "/dashboard/chatbot", icon: BotMessageSquare, label: "AI Chatbot" },
    { href: "/dashboard/drug-checker", icon: Pill, label: "Drug Checker" },
    { href: "/dashboard/skin-cancer-detection", icon: Scan, label: "Skin Cancer Detection" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
