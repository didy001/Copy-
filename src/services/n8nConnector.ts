/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { N8NWorkflow } from '../types';

export class N8NConnector {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.N8N_API_KEY || '';
    this.baseUrl = process.env.N8N_BASE_URL || '';
  }

  private get headers() {
    return {
      'X-N8N-API-KEY': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async createWorkflow(workflow: N8NWorkflow) {
    const response = await axios.post(`${this.baseUrl}/api/v1/workflows`, workflow, {
      headers: this.headers
    });
    return response.data;
  }

  async updateWorkflow(id: string, workflow: Partial<N8NWorkflow>) {
    const response = await axios.patch(`${this.baseUrl}/api/v1/workflows/${id}`, workflow, {
      headers: this.headers
    });
    return response.data;
  }

  async executeWorkflow(id: string) {
    const response = await axios.post(`${this.baseUrl}/api/v1/workflows/${id}/execute`, {}, {
      headers: this.headers
    });
    return response.data;
  }

  async listWorkflows() {
    const response = await axios.get(`${this.baseUrl}/api/v1/workflows`, {
      headers: this.headers
    });
    return response.data;
  }
}
