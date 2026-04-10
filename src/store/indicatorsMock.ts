import type { Indicator } from '../types/indicator';

export const mockIndicators: Indicator[] = [
  {
    id: 1,
    date: '2025-11-12',
    leads_new: 12,
    leads_hot: 5,
    calls_made: 28,
    whatsapp_sent: 45,
    campaign_roi: 325.5,
    total_reviews: 87,
    avg_rating: 4.6,
    sales_today: 8450.00,
    sales_mtd: 125680.50,
    created_at: '2025-11-12T23:59:00Z',
    updated_at: '2025-11-12T23:59:00Z',
  },
  {
    id: 2,
    date: '2025-11-11',
    leads_new: 15,
    leads_hot: 7,
    calls_made: 32,
    whatsapp_sent: 52,
    campaign_roi: 298.3,
    total_reviews: 85,
    avg_rating: 4.5,
    sales_today: 9870.00,
    sales_mtd: 117230.50,
    created_at: '2025-11-11T23:59:00Z',
    updated_at: '2025-11-11T23:59:00Z',
  },
  {
    id: 3,
    date: '2025-11-10',
    leads_new: 8,
    leads_hot: 4,
    calls_made: 24,
    whatsapp_sent: 38,
    campaign_roi: 412.8,
    total_reviews: 83,
    avg_rating: 4.5,
    sales_today: 6320.00,
    sales_mtd: 107360.50,
    created_at: '2025-11-10T23:59:00Z',
    updated_at: '2025-11-10T23:59:00Z',
  },
  {
    id: 4,
    date: '2025-11-09',
    leads_new: 18,
    leads_hot: 9,
    calls_made: 35,
    whatsapp_sent: 48,
    campaign_roi: 385.7,
    total_reviews: 82,
    avg_rating: 4.6,
    sales_today: 11240.00,
    sales_mtd: 101040.50,
    created_at: '2025-11-09T23:59:00Z',
    updated_at: '2025-11-09T23:59:00Z',
  },
  {
    id: 5,
    date: '2025-11-08',
    leads_new: 10,
    leads_hot: 6,
    calls_made: 26,
    whatsapp_sent: 41,
    campaign_roi: 356.2,
    total_reviews: 80,
    avg_rating: 4.5,
    sales_today: 7850.00,
    sales_mtd: 89800.50,
    created_at: '2025-11-08T23:59:00Z',
    updated_at: '2025-11-08T23:59:00Z',
  },
];

export const getMockIndicators = (): Indicator[] => [...mockIndicators];
export const getMockIndicatorById = (id: number) => mockIndicators.find(i => i.id === id);
export const getMockIndicatorByDate = (date: string) => mockIndicators.find(i => i.date === date);
export const getMockIndicatorsByDateRange = (startDate: string, endDate: string) => 
  mockIndicators.filter(i => i.date >= startDate && i.date <= endDate).sort((a, b) => b.date.localeCompare(a.date));
export const getMockLatestIndicator = () => mockIndicators[0];
export const calculateAverageKPI = (kpi: keyof Omit<Indicator, 'id' | 'date' | 'created_at' | 'updated_at'>) => {
  const sum = mockIndicators.reduce((acc, ind) => acc + (ind[kpi] as number), 0);
  return sum / mockIndicators.length;
};
