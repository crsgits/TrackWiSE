
"use client";

import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <GraduationCap className="h-7 w-7" />
            <span className="group-data-[collapsible=icon]:hidden">TrackWIsE</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-sidebar-foreground/70">© {new Date().getFullYear()} TrackWIsE</p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 md:justify-end">
          {/* Mobile sidebar trigger - shown on left side in header */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          {/* Desktop sidebar trigger - can be placed here or elsewhere */}
          <div className="hidden md:block">
             {/* Placeholder for potential header actions like User Profile Dropdown */}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
