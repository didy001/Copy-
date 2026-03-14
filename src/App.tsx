/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TemplateLibrary from './components/TemplateLibrary';
import AutomationBuilder from './components/AutomationBuilder';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'library':
        return <TemplateLibrary />;
      case 'builder':
        return <AutomationBuilder />;
      case 'settings':
        return (
          <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-sm max-w-2xl">
            <h3 className="text-xl font-bold mb-6">System Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#141414]/40 uppercase tracking-wider mb-2">n8n API Key</label>
                <input type="password" value="••••••••••••••••" readOnly className="w-full p-4 bg-[#141414]/5 rounded-xl border-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#141414]/40 uppercase tracking-wider mb-2">n8n Base URL</label>
                <input type="text" value="https://n8n.example.com" readOnly className="w-full p-4 bg-[#141414]/5 rounded-xl border-none" />
              </div>
              <p className="text-sm text-[#141414]/40 italic">Settings are managed via environment variables for security.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
