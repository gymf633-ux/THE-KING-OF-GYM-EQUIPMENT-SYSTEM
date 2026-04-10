/**
 * KPI Indicators - Daily snapshot of key performance metrics
 */
export interface Indicator {
  id: number;
  date: string;
  leads_new: number;
  leads_hot: number;
  calls_made: number;
  whatsapp_sent: number;
  campaign_roi: number;
  total_reviews: number;
  avg_rating: number;
  sales_today: number;
  sales_mtd: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIndicatorInput {
  date: string;
  leads_new?: number;
  leads_hot?: number;
  calls_made?: number;
  whatsapp_sent?: number;
  campaign_roi?: number;
  total_reviews?: number;
  avg_rating?: number;
  sales_today?: number;
  sales_mtd?: number;
}

export interface UpdateIndicatorInput {
  leads_new?: number;
  leads_hot?: number;
  calls_made?: number;
  whatsapp_sent?: number;
  campaign_roi?: number;
  total_reviews?: number;
  avg_rating?: number;
  sales_today?: number;
  sales_mtd?: number;
}
