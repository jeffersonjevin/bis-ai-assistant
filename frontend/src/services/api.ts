// API service abstraction layer.
// All functions currently return mock data with a simulated network delay.
// Swap the internals of each function for real fetch() calls once the backend
// (POST /api/chat, GET /api/standards, GET /api/laboratories, GET /api/services)
// is available — the calling components will not need to change.

import type { AssistantAnswer, Standard, Laboratory, ServiceKey, ServiceDetail } from '../types';
import { mockStandards } from '../data/standards';
import { mockLaboratories } from '../data/laboratories';
import { serviceDetails } from '../data/services';
import { generateMockAnswer } from '../data/chatResponses';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function askAssistant(question: string): Promise<AssistantAnswer> {
  await delay(900 + Math.random() * 600);
  return generateMockAnswer(question);
}

export interface StandardsFilter {
  query?: string;
  category?: string;
  status?: string;
  certificationOnly?: boolean;
}

export async function searchStandards(filter: StandardsFilter = {}): Promise<Standard[]> {
  await delay(400);
  const q = filter.query?.toLowerCase().trim();
  return mockStandards.filter((s) => {
    if (q) {
      const haystack = `${s.number} ${s.title} ${s.category} ${s.industry}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filter.category && filter.category !== 'All' && s.category !== filter.category) return false;
    if (filter.status && filter.status !== 'All' && s.status !== filter.status) return false;
    if (filter.certificationOnly && !s.certificationApplicable) return false;
    return true;
  });
}

export interface LabFilter {
  query?: string;
  state?: string;
  type?: string;
  standard?: string;
}

export async function searchLaboratories(filter: LabFilter = {}): Promise<Laboratory[]> {
  await delay(400);
  const q = filter.query?.toLowerCase().trim();
  return mockLaboratories.filter((l) => {
    if (q) {
      const haystack = `${l.name} ${l.city} ${l.state} ${l.testingAreas.join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filter.state && filter.state !== 'All' && l.state !== filter.state) return false;
    if (filter.type && filter.type !== 'All' && l.type !== filter.type) return false;
    if (filter.standard && !l.applicableStandards.includes(filter.standard)) return false;
    return true;
  });
}

export async function getServiceDetails(key: ServiceKey): Promise<ServiceDetail | undefined> {
  await delay(200);
  return serviceDetails.find((s) => s.key === key);
}

export async function getAllServices(): Promise<ServiceDetail[]> {
  await delay(200);
  return serviceDetails;
}
