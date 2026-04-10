import type { Settings } from '../types/settings';

export const mockSettings: Settings = {
  id: 1,
  business_profile: {
    name: 'The King of Gym Equipment',
    address: 'Shalin Sky, RO Water Plant, Ahmedabad, Gujarat – 380059',
    gstin: '24AAAAA0000A1Z5',
    logo_url: 'https://via.placeholder.com/200x80?text=The+King+of+Gym+Equipment',
  },
  whatsapp_api: {
    token: 'WHATSAPP_API_TOKEN_PLACEHOLDER',
    phone_number_id: '7228800146',
    sender_id: '+917228800146',
  },
  gbp_api: {
    credentials: 'GBP_CREDENTIALS_PLACEHOLDER',
  },
  default_currency: 'INR',
  language: 'en',
  animation_speed: 1,
  pricing: {
    plans_visible: false, // Personal use - hide pricing
  },
  notification_prefs: {
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    daily_summary: true,
  },
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-11-12T10:11:50Z',
};

export const getMockSettings = (): Settings => ({ ...mockSettings });
export const updateMockSettings = (updates: Partial<Settings>): Settings => {
  Object.assign(mockSettings, updates);
  mockSettings.updated_at = new Date().toISOString();
  return getMockSettings();
};
