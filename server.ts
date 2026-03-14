/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { WorkflowGenerator } from './src/services/workflowGenerator';
import { N8NConnector } from './src/services/n8nConnector';

import { db } from './src/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const n8nConnector = new N8NConnector();

  // API Routes
  app.post('/api/templates', async (req, res) => {
    try {
      const template = req.body;
      const docRef = await addDoc(collection(db, 'templates'), {
        ...template,
        createdAt: serverTimestamp()
      });
      res.json({ id: docRef.id, ...template });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/templates', async (req, res) => {
    try {
      const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const templates = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/workflow/generate', (req, res) => {
    try {
      const { template, variables } = req.body;
      const workflow = WorkflowGenerator.generate(template, variables);
      res.json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/workflow/deploy', async (req, res) => {
    try {
      const { workflow } = req.body;
      const result = await n8nConnector.createWorkflow(workflow);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/dashboard/overview', async (_req, res) => {
    try {
      const templatesSnapshot = await getDocs(collection(db, 'templates'));
      const totalAutomations = templatesSnapshot.size;

      let activeWorkflows = 0;

      if (n8nConnector.isConfigured()) {
        try {
          const n8nListResponse = await n8nConnector.listWorkflows();
          const workflows = Array.isArray(n8nListResponse?.data)
            ? n8nListResponse.data
            : Array.isArray(n8nListResponse)
              ? n8nListResponse
              : [];

          activeWorkflows = workflows.filter((workflow: any) => workflow?.active === true).length;
        } catch {
          // n8n is optional in local dev; keep endpoint resilient
        }
      }

      res.json({
        totalAutomations,
        activeWorkflows,
        executions24h: null,
        failedRuns: null,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
