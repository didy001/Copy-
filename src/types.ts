/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AutomationNode {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  position: [number, number];
}

export interface AutomationConnection {
  main: Array<Array<{
    node: string;
    type: string;
    index: number;
  }>>;
}

export interface AutomationTemplate {
  id?: string;
  name: string;
  description: string;
  variables: string[];
  nodes: AutomationNode[];
  connections: Record<string, AutomationConnection>;
  version: number;
  createdAt?: any;
}

export interface N8NWorkflow {
  name: string;
  nodes: any[];
  connections: any;
  settings?: any;
  staticData?: any;
  meta?: any;
}
