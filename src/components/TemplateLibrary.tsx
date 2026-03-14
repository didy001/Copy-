/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MoreVertical, Play, Edit2, Trash2, Loader2 } from 'lucide-react';
import { AutomationTemplate } from '../types';

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#141414]/20" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#141414]/40" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#141414]/10 rounded-xl focus:ring-2 focus:ring-[#141414] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-[#141414]/10 rounded-xl font-semibold hover:bg-[#141414]/5 transition-colors">
          <Filter size={20} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white p-6 rounded-3xl border border-[#141414]/5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-[#141414]/5 rounded-2xl flex items-center justify-center text-[#141414]/40 group-hover:bg-[#141414] group-hover:text-white transition-colors">
                <Play size={20} />
              </div>
              <button className="p-2 hover:bg-[#141414]/5 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-[#141414]/40" />
              </button>
            </div>

            <h4 className="text-lg font-bold mb-1">{template.name}</h4>
            <p className="text-sm text-[#141414]/60 mb-6 line-clamp-2">{template.description}</p>

            <div className="flex items-center justify-between pt-6 border-t border-[#141414]/5">
              <div className="flex gap-4 text-xs font-bold text-[#141414]/40 uppercase tracking-wider">
                <span>{template.nodes.length} Nodes</span>
                <span>v{template.version}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
