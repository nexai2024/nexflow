# Data & Schema Model

## Domain Types & Structures

```typescript
export interface SoftwareTool {
  id: string;
  name: string;
  category: string;
  description: string;
  avgMonthlyPrice: number;
  commonIntegrations: string[];
  capabilities: string[];
  websiteUrl?: string;
  logoIcon?: string;
}

export interface BusinessGoal {
  id: string;
  name: string;
  category: string;
  description: string;
  recommendedStepTemplates: {
    stepNumber: number;
    title: string;
    description: string;
    preferredCategories: string[];
    defaultToolId: string;
    alternativeToolIds: string[];
  }[];
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  recommendedTool: SoftwareTool;
  alternativeTools: SoftwareTool[];
  selectedToolId: string;
  isExistingTool: boolean;
  notes?: string;
}

export interface UserStackTool {
  toolId: string;
  customPrice?: number;
  isExisting: boolean;
}

export interface StackWorkflow {
  id: string;
  goal: BusinessGoal;
  steps: WorkflowStep[];
  existingToolIds: string[];
  customPrices: Record<string, number>;
  createdAt: string;
}
```

No database migrations required for local-first client domain state.
