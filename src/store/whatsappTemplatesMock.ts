import type { WhatsAppTemplate } from '../types/whatsappTemplate';

/**
 * Mock WhatsApp templates data for development and testing
 */
export const mockWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 1,
    name: 'welcome_new_lead',
    category: 'marketing',
    language: 'en',
    body_text: 'Hi {{1}}! 👋 Thanks for your interest in {{2}}. Our team will reach out within 24 hours to discuss how we can help with {{3}}. Reply STOP to unsubscribe.',
    header_type: 'text',
    header_text: 'Welcome to Our Service!',
    variables: ['customer_name', 'company_name', 'interest_category'],
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-10T14:30:00Z',
  },
  {
    id: 2,
    name: 'appointment_reminder',
    category: 'utility',
    language: 'en',
    body_text: 'Hello {{1}}, this is a reminder about your appointment scheduled for {{2}} at {{3}}. Please reply YES to confirm or NO to reschedule.',
    header_type: 'none',
    variables: ['customer_name', 'appointment_date', 'appointment_time'],
    created_at: '2025-10-28T09:15:00Z',
    updated_at: '2025-11-08T11:20:00Z',
  },
  {
    id: 3,
    name: 'verification_code',
    category: 'auth',
    language: 'en',
    body_text: 'Your verification code is: {{1}}\n\nThis code will expire in {{2}} minutes. Do not share this code with anyone.',
    header_type: 'text',
    header_text: '🔐 Security Code',
    variables: ['verification_code', 'expiry_minutes'],
    created_at: '2025-11-05T16:45:00Z',
    updated_at: '2025-11-11T09:00:00Z',
  },
  {
    id: 4,
    name: 'special_promotion',
    category: 'marketing',
    language: 'en',
    body_text: '🎉 Special offer for you, {{1}}! Get {{2}}% off on {{3}}. Use code: {{4}} at checkout. Valid until {{5}}. Shop now: {{6}}',
    header_type: 'image',
    header_image_url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop',
    variables: ['customer_name', 'discount_percentage', 'product_name', 'promo_code', 'expiry_date', 'shop_url'],
    created_at: '2025-11-08T13:20:00Z',
    updated_at: '2025-11-12T08:00:00Z',
  },
];

/**
 * Get all mock WhatsApp templates
 */
export const getMockWhatsAppTemplates = (): WhatsAppTemplate[] => {
  return [...mockWhatsAppTemplates];
};

/**
 * Get mock template by ID
 */
export const getMockWhatsAppTemplateById = (id: number): WhatsAppTemplate | undefined => {
  return mockWhatsAppTemplates.find(template => template.id === id);
};

/**
 * Get mock templates by category
 */
export const getMockWhatsAppTemplatesByCategory = (
  category: WhatsAppTemplate['category']
): WhatsAppTemplate[] => {
  return mockWhatsAppTemplates.filter(template => template.category === category);
};

/**
 * Get mock templates by language
 */
export const getMockWhatsAppTemplatesByLanguage = (language: string): WhatsAppTemplate[] => {
  return mockWhatsAppTemplates.filter(template => template.language === language);
};

/**
 * Parse variables from template body text
 * Extracts {{1}}, {{2}}, etc. patterns
 */
export const parseTemplateVariables = (bodyText: string): number => {
  const matches = bodyText.match(/\{\{(\d+)\}\}/g);
  return matches ? matches.length : 0;
};

/**
 * Render template with variable values
 */
export const renderTemplate = (
  template: WhatsAppTemplate,
  values: Record<string, string>
): string => {
  let rendered = template.body_text;
  
  template.variables.forEach((variable, index) => {
    const placeholder = `{{${index + 1}}}`;
    const value = values[variable] || placeholder;
    rendered = rendered.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return rendered;
};
