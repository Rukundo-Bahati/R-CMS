import { ReactNode } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
      <Sidebar />
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? "ml-20" : "ml-64"
      }`}>
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full px-6 py-6">
          <div className="w-full max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
