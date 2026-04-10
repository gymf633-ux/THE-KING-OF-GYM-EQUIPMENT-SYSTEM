import type { Competitor } from '../types/competitor';

export const mockCompetitors: Competitor[] = [
  {
    id: 1,
    name: 'Acme Solutions Inc',
    keywords: ['crm software', 'business automation', 'sales management'],
    rank_position: 3,
    last_checked_at: '2025-11-12T08:00:00Z',
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-11-12T08:00:00Z',
  },
  {
    id: 2,
    name: 'TechFlow Systems',
    keywords: ['marketing automation', 'lead generation', 'analytics'],
    rank_position: 5,
    last_checked_at: '2025-11-11T15:30:00Z',
    created_at: '2025-10-20T14:00:00Z',
    updated_at: '2025-11-11T15:30:00Z',
  },
  {
    id: 3,
    name: 'CloudBiz Pro',
    keywords: ['cloud crm', 'customer management', 'pipeline tracking'],
    rank_position: 2,
    last_checked_at: '2025-11-12T07:45:00Z',
    created_at: '2025-10-18T09:30:00Z',
    updated_at: '2025-11-12T07:45:00Z',
  },
];

export const getMockCompetitors = (): Competitor[] => [...mockCompetitors];
export const getMockCompetitorById = (id: number) => mockCompetitors.find(c => c.id === id);
export const getMockCompetitorsByRank = () => [...mockCompetitors].sort((a, b) => a.rank_position - b.rank_position);
export const getMockCompetitorsByKeyword = (keyword: string) => 
  mockCompetitors.filter(c => c.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())));
