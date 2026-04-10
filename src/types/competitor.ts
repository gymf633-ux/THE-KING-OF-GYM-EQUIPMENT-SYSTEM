export interface Competitor {
  id: number;
  name: string;
  keywords: string[];
  rank_position: number;
  last_checked_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompetitorInput {
  name: string;
  keywords: string[];
  rank_position: number;
  last_checked_at?: string;
}

export interface UpdateCompetitorInput {
  name?: string;
  keywords?: string[];
  rank_position?: number;
  last_checked_at?: string;
}
