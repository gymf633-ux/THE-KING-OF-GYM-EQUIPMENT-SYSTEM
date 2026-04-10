import type { Campaign } from '../types/campaign';

/**
 * Mock campaigns data for development and testing
 */
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    type: 'lead_conversion',
    title: 'New Gym Equipment Offers',
    message_template_id: 'template_001',
    message: 'Hello, check out our new gym equipment offers!',
    audience_filter: 'name:Test Lead',
    schedule_at: '2025-11-13T09:00:00Z',
    sent_count: 1,
    delivered: 1,
    clicks: 0,
    conversions: 0,
    spend: 0,
    revenue: 0,
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    type: 'lead_conversion',
    title: 'Q4 Gym Equipment Promotion',
    message_template_id: 'template_002',
    audience_filter: 'status:warm,hot',
    schedule_at: '2025-11-15T09:00:00Z',
    sent_count: 125,
    delivered: 120,
    clicks: 34,
    conversions: 12,
    spend: 5000.00,
    revenue: 185000.00,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-12T08:30:00Z',
  },
  {
    id: 3,
    type: 'repeat_sale',
    title: 'Existing Customer Upsell - Accessories',
    message_template_id: 'template_003',
    audience_filter: 'status:won',
    schedule_at: '2025-11-18T14:00:00Z',
    sent_count: 85,
    delivered: 823,
    clicks: 198,
    conversions: 54,
    spend: 320.00,
    revenue: 8640.00,
    created_at: '2025-10-28T11:30:00Z',
    updated_at: '2025-11-11T16:45:00Z',
  },
  {
    id: 3,
    type: 'google_review',
    title: 'Happy Customer Review Request',
    message_template_id: 'template_003',
    audience_filter: 'status:won',
    schedule_at: '2025-11-20T10:00:00Z',
    sent_count: 432,
    delivered: 421,
    clicks: 156,
    conversions: 89,
    spend: 125.00,
    revenue: 0.00,
    created_at: '2025-11-05T09:00:00Z',
    updated_at: '2025-11-12T07:15:00Z',
  },
  {
    id: 4,
    type: 'custom',
    title: 'Black Friday Special Offer',
    message_template_id: 'template_004',
    audience_filter: 'source:instagram,gbp',
    schedule_at: '2025-11-29T06:00:00Z',
    sent_count: 2180,
    delivered: 2098,
    clicks: 624,
    conversions: 187,
    spend: 780.00,
    revenue: 28050.00,
    created_at: '2025-11-08T14:20:00Z',
    updated_at: '2025-11-12T08:00:00Z',
  },
  {
    id: 5,
    type: 'lead_conversion',
    title: 'New Lead Welcome Series',
    message_template_id: 'template_005',
    audience_filter: 'status:new',
    schedule_at: '2025-11-14T08:00:00Z',
    sent_count: 987,
    delivered: 945,
    clicks: 289,
    conversions: 72,
    spend: 395.00,
    revenue: 10800.00,
    created_at: '2025-10-30T13:45:00Z',
    updated_at: '2025-11-11T19:30:00Z',
  },
];

/**
 * Get all mock campaigns
 */
export const getMockCampaigns = (): Campaign[] => {
  return [...mockCampaigns];
};

/**
 * Get mock campaign by ID
 */
export const getMockCampaignById = (id: number): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id);
};

/**
 * Get mock campaigns by type
 */
export const getMockCampaignsByType = (type: Campaign['type']): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.type === type);
};

/**
 * Calculate campaign ROI (Return on Investment)
 */
export const calculateCampaignROI = (campaign: Campaign): number => {
  if (campaign.spend === 0) return 0;
  return ((campaign.revenue - campaign.spend) / campaign.spend) * 100;
};

/**
 * Calculate campaign conversion rate
 */
export const calculateConversionRate = (campaign: Campaign): number => {
  if (campaign.delivered === 0) return 0;
  return (campaign.conversions / campaign.delivered) * 100;
};

/**
 * Calculate campaign click-through rate (CTR)
 */
export const calculateCTR = (campaign: Campaign): number => {
  if (campaign.delivered === 0) return 0;
  return (campaign.clicks / campaign.delivered) * 100;
};
