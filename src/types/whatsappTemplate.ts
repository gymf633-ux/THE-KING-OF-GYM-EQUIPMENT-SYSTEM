export type TemplateCategory = 'marketing' | 'utility' | 'auth';
export type HeaderType = 'none' | 'text' | 'image';

export interface WhatsAppTemplate {
  id: number;
  name: string;
  category: TemplateCategory;
  language: string;
  body_text: string;
  header_type: HeaderType;
  header_text?: string;
  header_image_url?: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateWhatsAppTemplateInput {
  name: string;
  category: TemplateCategory;
  language: string;
  body_text: string;
  header_type: HeaderType;
  header_text?: string;
  header_image_url?: string;
  variables?: string[];
}

export interface UpdateWhatsAppTemplateInput {
  name?: string;
  category?: TemplateCategory;
  language?: string;
  body_text?: string;
  header_type?: HeaderType;
  header_text?: string;
  header_image_url?: string;
  variables?: string[];
}
