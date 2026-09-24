"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../lib/auth/AuthProvider";
import { runAgent } from "../../lib/api/agent";
import { useSWRConfig } from "swr";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  const handleRunAgent = async () => {
    if (!user?.id || isAgentRunning) return;
    setIsAgentRunning(true);
    try {
      await runAgent(user.id);
      // Invalidate all dashboard & module data so everything updates immediately!
      mutate(`/dashboard/${user.id}`);
      mutate(`/income/${user.id}`);
      mutate(`/income/${user.id}/stats`);
      mutate(`/wallet/${user.id}`);
      mutate(`/wallet/${user.id}/goals`);
      mutate(`/savings/${user.id}`);
      mutate(`/recommendation/${user.id}`);
      mutate(`/tax/${user.id}`);
    } catch (e) {
      console.error("Agent execution error:", e);
    } finally {
      setIsAgentRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#18181B] selection:bg-[#F97316]/15 selection:text-[#EA580C] flex flex-col font-sans">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onRunAgent={handleRunAgent}
          isAgentRunning={isAgentRunning}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
