export type StandardStatus = 'Active' | 'Withdrawn' | 'Reaffirmed' | 'Amended' | 'Superseded';

export interface Standard {
  id: string;
  number: string; // e.g. "IS 302 (Part 1)"
  title: string;
  category: string;
  industry: string;
  status: StandardStatus;
  certificationApplicable: boolean;
  scheme?: string;
  testingRequired: boolean;
  relatedInformation: string;
  lastUpdated: string; // placeholder
  sourceTitle: string;
  sourceUrl: string;
}

export interface Laboratory {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'Government' | 'Private';
  testingAreas: string[];
  applicableStandards: string[];
  sourceTitle: string;
  sourceUrl: string;
}

export type ServiceKey = 'certification' | 'laboratories' | 'hallmarking' | 'consumer';

export interface ServiceStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceDetail {
  key: ServiceKey;
  name: string;
  icon: string;
  description: string;
  steps: ServiceStep[];
  faqs: { question: string; answer: string }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SourceRef {
  title: string;
  url: string;
  page?: number;
  excerpt: string;
  sourceType: 'Official BIS' | 'Government Source';
}

export interface AssistantAnswer {
  answer: string;
  confidence: 'High' | 'Medium' | 'Low';
  relevantStandard?: {
    number: string;
    title: string;
  };
  certification?: string;
  testing?: string;
  sources: SourceRef[];
  relatedStandards?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  answer?: AssistantAnswer;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}
