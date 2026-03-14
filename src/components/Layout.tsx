/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, Library, PlusCircle, Settings, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'library', icon: Library, label: 'Templates' },
    { id: 'builder', icon: PlusCircle, label: 'New Automation' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex font-sans text-[#141414]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#141414]/10 flex flex-col">
        <div className="p-6 border-bottom border-[#141414]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#141414] rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">n8n Factory</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-[#141414] text-white shadow-md'
                  : 'hover:bg-[#141414]/5 text-[#141414]/60'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#141414]/10">
          <div className="bg-[#141414]/5 p-4 rounded-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#141414]/40 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">n8n Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#141414]/10 flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#141414]/10 flex items-center justify-center">
              <span className="text-xs font-bold">JD</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
