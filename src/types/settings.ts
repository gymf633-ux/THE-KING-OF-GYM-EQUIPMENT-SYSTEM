export interface BusinessProfile {
  name: string;
  address: string;
  gstin: string;
  logo_url?: string | null;
}

export interface WhatsAppAPI {
  token: string;
  phone_number_id: string;
  sender_id: string;
}

export interface GBPAPI {
  credentials: string;
}

export interface Pricing {
  plans_visible: boolean;
}

export interface NotificationPrefs {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  daily_summary: boolean;
}

export interface Settings {
  id: number;
  business_profile: BusinessProfile;
  whatsapp_api: WhatsAppAPI;
  gbp_api: GBPAPI;
  pricing: Pricing;
  notification_prefs: NotificationPrefs;
  default_currency?: string;
  language?: string;
  animation_speed?: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateSettingsInput {
  business_profile?: Partial<BusinessProfile>;
  whatsapp_api?: Partial<WhatsAppAPI>;
  gbp_api?: Partial<GBPAPI>;
  pricing?: Partial<Pricing>;
  notification_prefs?: Partial<NotificationPrefs>;
}
