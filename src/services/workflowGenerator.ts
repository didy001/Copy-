/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutomationTemplate, N8NWorkflow } from '../types';

export class WorkflowGenerator {
  static generate(template: AutomationTemplate, variableValues: Record<string, string> = {}): N8NWorkflow {
    // Deep clone nodes to avoid mutating template
    const nodes = template.nodes.map(node => {
      const newNode = { ...node };
      
      // Replace variables in parameters
      const paramsString = JSON.stringify(newNode.parameters);
      let processedParams = paramsString;
      
      for (const [key, value] of Object.entries(variableValues)) {
        const placeholder = `{{${key}}}`;
        processedParams = processedParams.split(placeholder).join(value);
      }
      
      newNode.parameters = JSON.parse(processedParams);
      return newNode;
    });

    return {
      name: template.name,
      nodes: nodes.map(n => ({
        parameters: n.parameters,
        id: n.id,
        name: n.name,
        type: n.type,
        typeVersion: 1,
        position: n.position
      })),
      connections: template.connections,
      settings: {},
      meta: {
        instanceId: "automation-factory"
      }
    };
  }
}
