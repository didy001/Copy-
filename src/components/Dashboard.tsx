/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, CheckCircle2, AlertCircle, PlusCircle, Zap } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Automations', value: '12', icon: Play, color: 'bg-blue-500' },
    { label: 'Active Workflows', value: '8', icon: CheckCircle2, color: 'bg-emerald-500' },
    { label: 'Executions (24h)', value: '142', icon: Clock, color: 'bg-violet-500' },
    { label: 'Failed Runs', value: '3', icon: AlertCircle, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#141414]/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-lg text-white`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-bold text-emerald-500">+12%</span>
            </div>
            <p className="text-[#141414]/40 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-6 border-b border-[#141414]/5 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-[#141414]/5 flex items-center justify-center">
                  <Play size={18} className="text-[#141414]/60" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Lead Scraper v2 Executed</p>
                  <p className="text-sm text-[#141414]/40">Successfully processed 42 leads</p>
                </div>
                <span className="text-xs text-[#141414]/40 font-medium">2m ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-6 bg-[#141414] text-white rounded-2xl flex flex-col items-center gap-3 hover:opacity-90 transition-opacity">
              <PlusCircle size={24} />
              <span className="font-semibold">New Template</span>
            </button>
            <button className="p-6 bg-white border border-[#141414]/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-[#141414]/5 transition-colors">
              <Zap size={24} />
              <span className="font-semibold">AI Generate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

