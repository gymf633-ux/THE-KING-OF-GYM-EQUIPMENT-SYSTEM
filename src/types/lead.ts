export type LeadSource = 'call' | 'gbp' | 'instagram' | 'manual';
export type LeadStatus = 'new' | 'warm' | 'hot' | 'won' | 'lost';

export interface Lead {
  id: number;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  interest_category?: string;
  last_contact_at?: string;
  next_followup_at?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  name: string;
  phone: string;
  source: LeadSource;
  status?: LeadStatus;
  interest_category?: string;
  last_contact_at?: string;
  next_followup_at?: string;
  assigned_to?: string;
  notes?: string;
}

export interface UpdateLeadInput {
  name?: string;
  phone?: string;
  source?: LeadSource;
  status?: LeadStatus;
  interest_category?: string;
  last_contact_at?: string;
  next_followup_at?: string;
  assigned_to?: string;
  notes?: string;
}
