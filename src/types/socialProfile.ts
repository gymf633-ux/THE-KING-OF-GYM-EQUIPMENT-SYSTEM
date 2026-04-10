export interface SocialProfile {
  id: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'pinterest' | 'youtube' | 'google_business';
  profile_url: string;
  access_token?: string;
  token_expiry?: string;
  status: 'active' | 'expired' | 'disconnected';
  profile_name?: string;
  follower_count?: number;
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyDetails {
  company_name: string;
  logo_url?: string;
  phone: string;
  email: string;
  address: string;
  gst_number?: string;
  bank_details?: {
    account_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
  };
  website_primary: string;
  website_secondary?: string;
}
