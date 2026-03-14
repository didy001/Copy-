/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AutomationTemplate } from "../types";

export class AIAssistant {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async generateTemplate(prompt: string): Promise<AutomationTemplate> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Generate an n8n automation template based on this request: "${prompt}".
      
      Return a JSON object that matches this structure:
      {
        "name": "Descriptive Name",
        "description": "Short description",
        "variables": ["list", "of", "placeholders"],
        "nodes": [
          {
            "id": "unique-id",
            "name": "Node Name",
            "type": "n8n.nodeType",
            "parameters": {},
            "position": [x, y]
          }
        ],
        "connections": {
          "Node Name": {
            "main": [
              [
                { "node": "Next Node Name", "type": "main", "index": 0 }
              ]
            ]
          }
        },
        "version": 1
      }
      
      Ensure the node types are valid n8n core nodes (e.g., n8n-nodes-base.webhook, n8n-nodes-base.httpRequest, n8n-nodes-base.googleSheets, etc.).
      Use placeholders like {{variableName}} in parameters where appropriate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            variables: { type: Type.ARRAY, items: { type: Type.STRING } },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  parameters: { type: Type.OBJECT },
                  position: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                }
              }
            },
            connections: { type: Type.OBJECT },
            version: { type: Type.NUMBER }
          },
          required: ["name", "description", "nodes", "connections"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AutomationTemplate;
  }
}
