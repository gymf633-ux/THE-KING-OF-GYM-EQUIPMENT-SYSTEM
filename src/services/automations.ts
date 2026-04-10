import { Lead, CreateLeadInput } from '../types/lead';
import { Reminder, CreateReminderInput } from '../types/reminder';

/**
 * Automation configuration
 */
export const AUTOMATION_CONFIG = {
  defaultOwner: 'System Admin', // Default owner for new leads
  followUpDelayHours: 24, // Hours to wait before creating follow-up reminder
};

/**
 * Automation event types
 */
export type AutomationEvent = 
  | { type: 'LEAD_CREATED'; payload: Lead }
  | { type: 'LEAD_STATUS_CHANGED'; payload: { lead: Lead; oldStatus: string; newStatus: string } }
  | { type: 'SALE_SAVED'; payload: any }
  | { type: 'CAMPAIGN_SCHEDULED'; payload: any }
  | { type: 'REVIEW_RECEIVED'; payload: any }
  | { type: 'DAILY_SNAPSHOT'; payload: { date: string } };

/**
 * Automation handler result
 */
export interface AutomationResult {
  success: boolean;
  message: string;
  reminders?: Reminder[];
  notifications?: string[];
}

/**
 * Core automation service
 */
class AutomationService {
  private reminderStore: Reminder[] = [];
  private nextReminderId = 1000;

  /**
   * Initialize automation service with existing reminders
   */
  initialize(reminders: Reminder[]) {
    this.reminderStore = [...reminders];
    if (reminders.length > 0) {
      this.nextReminderId = Math.max(...reminders.map(r => r.id)) + 1;
    }
  }

  /**
   * Get all reminders created by automations
   */
  getReminders(): Reminder[] {
    return [...this.reminderStore];
  }

  /**
   * Process automation event
   */
  async processEvent(event: AutomationEvent): Promise<AutomationResult> {
    switch (event.type) {
      case 'LEAD_CREATED':
        return this.handleLeadCreated(event.payload);
      
      case 'LEAD_STATUS_CHANGED':
        return this.handleLeadStatusChanged(event.payload);
      
      default:
        return { success: true, message: 'Event not handled' };
    }
  }

  /**
   * Automation: On Lead Created
   * - Ensure status is 'new'
   * - Ensure owner is assigned
   * - Create 24-hour follow-up reminder
   */
  private handleLeadCreated(lead: Lead): AutomationResult {
    const reminders: Reminder[] = [];
    const notifications: string[] = [];

    // Create follow-up reminder
    const followUpDate = new Date();
    followUpDate.setHours(followUpDate.getHours() + AUTOMATION_CONFIG.followUpDelayHours);

    const reminder: Reminder = {
      id: this.nextReminderId++,
      title: `Follow up with ${lead.name}`,
      due_at: followUpDate.toISOString(),
      object_type: 'lead',
      object_id: lead.id,
      priority: lead.status === 'hot' ? 'high' : 'medium',
      repeat: 'none',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.reminderStore.push(reminder);
    reminders.push(reminder);

    notifications.push(`✓ Lead created: ${lead.name}`);
    notifications.push(`✓ Follow-up reminder scheduled for ${followUpDate.toLocaleString()}`);
    
    if (lead.assigned_to) {
      notifications.push(`✓ Assigned to: ${lead.assigned_to}`);
    }

    return {
      success: true,
      message: `Lead automation completed for ${lead.name}`,
      reminders,
      notifications,
    };
  }

  /**
   * Automation: On Lead Status Changed to 'hot'
   * - Notify owner
   * - Create immediate "call now" reminder
   */
  private handleLeadStatusChanged({ lead, oldStatus, newStatus }: { lead: Lead; oldStatus: string; newStatus: string }): AutomationResult {
    const reminders: Reminder[] = [];
    const notifications: string[] = [];

    // Only trigger when status changes to 'hot'
    if (newStatus === 'hot' && oldStatus !== 'hot') {
      // Create immediate "call now" reminder
      const reminder: Reminder = {
        id: this.nextReminderId++,
        title: `🔥 HOT LEAD: Call ${lead.name} NOW`,
        due_at: new Date().toISOString(), // Immediate
        object_type: 'lead',
        object_id: lead.id,
        priority: 'high',
        repeat: 'none',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.reminderStore.push(reminder);
      reminders.push(reminder);

      // Notify owner
      if (lead.assigned_to) {
        notifications.push(`🔥 HOT LEAD ALERT: ${lead.name} needs immediate attention!`);
        notifications.push(`📞 Call ${lead.phone} now`);
        notifications.push(`👤 Assigned to: ${lead.assigned_to}`);
      } else {
        notifications.push(`🔥 HOT LEAD: ${lead.name} - No owner assigned!`);
      }
    }

    return {
      success: true,
      message: newStatus === 'hot' ? 'Hot lead automation triggered' : 'Status changed',
      reminders,
      notifications,
    };
  }
}

// Singleton instance
export const automationService = new AutomationService();

/**
 * Helper: Apply defaults to new lead
 */
export function applyLeadDefaults(leadInput: CreateLeadInput): CreateLeadInput {
  return {
    ...leadInput,
    status: 'new', // Always set to 'new' for new leads
    assigned_to: leadInput.assigned_to || AUTOMATION_CONFIG.defaultOwner,
  };
}
