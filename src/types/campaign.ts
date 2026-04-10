export type CampaignType = 'lead_conversion' | 'repeat_sale' | 'google_review' | 'custom';

export interface Campaign {
  id: number;
  type: CampaignType;
  title: string;
  message?: string;
  message_template_id?: string;
  audience_filter?: string;
  schedule_at?: string;
  sent_count: number;
  delivered: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  type: CampaignType;
  title: string;
  message_template_id?: string;
  audience_filter?: string;
  schedule_at?: string;
  sent_count?: number;
  delivered?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
}

export interface UpdateCampaignInput {
  type?: CampaignType;
  title?: string;
  message_template_id?: string;
  audience_filter?: string;
  schedule_at?: string;
  sent_count?: number;
  delivered?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
}
