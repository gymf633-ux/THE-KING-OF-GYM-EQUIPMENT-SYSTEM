import { WhatsAppAPI } from '../types/settings';
import { Lead } from '../types/lead';

/**
 * WhatsApp Cloud API Service
 * Handles sending messages via Meta WhatsApp Business API
 */

export interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'text' | 'template';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}

export interface TemplateVariable {
  key: string;
  value: string;
  description: string;
}

/**
 * Pre-configured WhatsApp templates
 */
export const WHATSAPP_TEMPLATES = {
  lead_conversion: {
    name: 'lead_conversion',
    category: 'marketing',
    body: 'Hi {{1}}, thanks for your enquiry about {{2}}. Can I share today\'s offer and book a demo?',
    variables: [
      { key: '{{1}}', value: 'name', description: 'Lead name' },
      { key: '{{2}}', value: 'interest_category', description: 'Interest/Product' },
    ],
  },
  repeat_sale: {
    name: 'repeat_sale',
    category: 'marketing',
    body: 'Hi {{1}}, it\'s time for your next {{2}}. Want a quick reorder?',
    variables: [
      { key: '{{1}}', value: 'name', description: 'Customer name' },
      { key: '{{2}}', value: 'product', description: 'Product/Service' },
    ],
  },
  google_review: {
    name: 'google_review',
    category: 'utility',
    body: 'Hi {{1}}, thanks for visiting! Could you spare 30 seconds to drop a quick Google review? {{2}}',
    variables: [
      { key: '{{1}}', value: 'name', description: 'Customer name' },
      { key: '{{2}}', value: 'review_link', description: 'Google Review URL' },
    ],
  },
};

/**
 * WhatsApp Service Class
 */
class WhatsAppService {
  private apiVersion = 'v17.0';

  /**
   * Send text message via WhatsApp Cloud API
   */
  async sendTextMessage(
    config: WhatsAppAPI,
    to: string,
    body: string
  ): Promise<SendMessageResult> {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatPhoneNumber(to),
        type: 'text',
        text: { body },
      };

      return await this.sendMessage(config, message);
    } catch (error) {
      console.error('Error sending text message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send template message with variable substitution
   */
  async sendTemplateMessage(
    config: WhatsAppAPI,
    to: string,
    templateName: string,
    variables: string[],
    languageCode: string = 'en'
  ): Promise<SendMessageResult> {
    try {
      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: this.formatPhoneNumber(to),
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: 'body',
              parameters: variables.map(text => ({
                type: 'text',
                text,
              })),
            },
          ],
        },
      };

      return await this.sendMessage(config, message);
    } catch (error) {
      console.error('Error sending template message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send message to WhatsApp Cloud API
   */
  private async sendMessage(
    config: WhatsAppAPI,
    message: WhatsAppMessage
  ): Promise<SendMessageResult> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${config.phone_number_id}/messages`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error?.message || 'Failed to send message',
          details: data.error,
        };
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        details: data,
      };
    } catch (error) {
      console.error('WhatsApp API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Format phone number to E.164 format (required by WhatsApp)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If doesn't start with country code, assume India (+91)
    if (!digits.startsWith('91') && digits.length === 10) {
      return `91${digits}`;
    }
    
    return digits;
  }

  /**
   * Map template variables from lead data
   */
  mapTemplateVariables(template: keyof typeof WHATSAPP_TEMPLATES, lead: Lead): string[] {
    const templateConfig = WHATSAPP_TEMPLATES[template];
    
    switch (template) {
      case 'lead_conversion':
        return [
          lead.name,
          lead.interest_category || 'our services',
        ];
      
      case 'repeat_sale':
        return [
          lead.name,
          lead.interest_category || 'service',
        ];
      
      case 'google_review':
        return [
          lead.name,
          'https://g.page/r/YOUR_REVIEW_LINK',
        ];
      
      default:
        return [];
    }
  }

  /**
   * Validate WhatsApp API configuration
   */
  validateConfig(config: WhatsAppAPI): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.token || config.token.trim() === '') {
      errors.push('WhatsApp API token is required');
    }

    if (!config.phone_number_id || config.phone_number_id.trim() === '') {
      errors.push('Phone Number ID is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const whatsappService = new WhatsAppService();
