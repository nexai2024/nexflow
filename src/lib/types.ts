export interface SoftwareTool {
  id: string;
  name: string;
  category: SoftwareCategory;
  description: string;
  avgMonthlyPrice: number;
  pricingTierSummary: string;
  commonIntegrations: string[];
  capabilities: string[];
  websiteUrl: string;
  iconName: string;
}

export type SoftwareCategory =
  | "Audio Editing & Hosting"
  | "Video Recording & Editing"
  | "E-Commerce & Storefront"
  | "Payment Processing"
  | "Email Marketing & Automation"
  | "CRM & Lead Pipeline"
  | "Project Management"
  | "Customer Support & Helpdesk"
  | "Analytics & Business Intelligence"
  | "Design & Media Assets"
  | "Form Builder & Data Collection"
  | "Community & Engagement"
  | "Workflow Automation & iPaaS";

export interface GoalStepTemplate {
  stepNumber: number;
  title: string;
  description: string;
  preferredCategory: SoftwareCategory;
  defaultToolId: string;
  alternativeToolIds: string[];
}

export interface BusinessGoal {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  estimatedTotalMonthlyCost: number;
  stepTemplates: GoalStepTemplate[];
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

export interface RedundancyAlert {
  category: SoftwareCategory;
  tools: SoftwareTool[];
  potentialMonthlySavings: number;
  recommendation: string;
}

export interface CostSummary {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  existingMonthlyCost: number;
  newRecommendedMonthlyCost: number;
  potentialSavings: number;
  toolBreakdown: {
    tool: SoftwareTool;
    effectiveMonthlyPrice: number;
    isCustomPrice: boolean;
    isExisting: boolean;
  }[];
}
