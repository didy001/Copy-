/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, CheckCircle, Rocket, Code } from 'lucide-react';
import { AutomationTemplate } from '../types';
import { AIAssistant } from '../services/aiAssistant';

export default function AutomationBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [template, setTemplate] = useState<AutomationTemplate | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);

  const aiAssistant = new AIAssistant();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generatedTemplate = await aiAssistant.generateTemplate(prompt);
      
      // Save to database via backend
      const saveResponse = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedTemplate),
      });
      const savedTemplate = await saveResponse.json();
      setTemplate(savedTemplate);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    if (!template) return;
    setIsDeploying(true);
    try {
      // 1. Generate n8n workflow JSON
      const genResponse = await fetch('/api/workflow/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, variables: {} }),
      });
      const workflow = await genResponse.json();

      // 2. Deploy to n8n
      const deployResponse = await fetch('/api/workflow/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflow }),
      });
      const result = await deployResponse.json();
      setDeployResult(result);
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* AI Input Section */}
      <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Automation Builder</h3>
            <p className="text-sm text-[#141414]/40">Describe your automation in plain English</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create an automation that watches for new Stripe payments and sends a personalized email via Gmail..."
            className="w-full h-32 p-6 bg-[#141414]/5 rounded-2xl border-none focus:ring-2 focus:ring-violet-500 transition-all resize-none text-lg"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="absolute bottom-4 right-4 bg-[#141414] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <AnimatePresence>
        {template && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl border border-[#141414]/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{template.name}</h3>
                  <p className="text-[#141414]/60">{template.description}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#141414]/5 rounded-lg text-sm font-semibold">
                    <Code size={16} /> Edit JSON
                  </button>
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {isDeploying ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
                    {isDeploying ? 'Deploying...' : 'Deploy to n8n'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#141414]/40">Workflow Structure</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.nodes.map((node, idx) => (
                    <div key={node.id} className="flex items-center gap-4 p-4 bg-[#141414]/5 rounded-2xl border border-[#141414]/5">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm font-bold text-[#141414]/20">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold">{node.name}</p>
                        <p className="text-xs text-[#141414]/40 font-mono">{node.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {deployResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Successfully Deployed!</h4>
                  <p className="text-emerald-700 text-sm">Your workflow is now live on n8n. ID: {deployResult.id}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
