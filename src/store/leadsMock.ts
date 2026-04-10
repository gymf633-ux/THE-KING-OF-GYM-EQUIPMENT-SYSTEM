import type { Lead } from '../types/lead';

/**
 * Mock leads data for development and testing
 */
export const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'Test Lead',
    phone: '9876543210',
    source: 'manual',
    status: 'new',
    interest_category: 'Gym Equipment',
    last_contact_at: '2025-11-12T10:11:50Z',
    next_followup_at: '2025-11-13T10:00:00Z',
    assigned_to: 'Sarah Johnson',
    notes: 'New lead for gym equipment inquiry. Needs follow-up call.',
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    name: 'John Smith',
    phone: '+1-555-0101',
    source: 'call',
    status: 'hot',
    interest_category: 'Commercial Gym Setup',
    last_contact_at: '2025-11-10T14:30:00Z',
    next_followup_at: '2025-11-13T10:00:00Z',
    assigned_to: 'Sarah Johnson',
    notes: 'Very interested in complete gym setup. Requested demo for next week.',
    created_at: '2025-11-05T09:15:00Z',
    updated_at: '2025-11-10T14:30:00Z',
  },
  {
    id: 3,
    name: 'Emily Davis',
    phone: '+1-555-0102',
    source: 'gbp',
    status: 'warm',
    interest_category: 'Home Gym Equipment',
    last_contact_at: '2025-11-09T11:00:00Z',
    next_followup_at: '2025-11-15T14:00:00Z',
    assigned_to: 'Mike Chen',
    notes: 'Found us through Google Business Profile. Interested in home gym setup.',
    created_at: '2025-11-08T16:45:00Z',
    updated_at: '2025-11-09T11:00:00Z',
  },
  {
    id: 4,
    name: 'Michael Brown',
    phone: '+1-555-0103',
    source: 'instagram',
    status: 'new',
    interest_category: 'Gym Benches & Racks',
    last_contact_at: '2025-11-11T09:30:00Z',
    next_followup_at: '2025-11-14T15:00:00Z',
    assigned_to: 'Lisa Wang',
    notes: 'Instagram inquiry about gym benches and power racks.',
    created_at: '2025-11-11T09:30:00Z',
    updated_at: '2025-11-11T09:30:00Z',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    phone: '+1-555-0104',
    source: 'manual',
    status: 'won',
    interest_category: 'CRM System',
    last_contact_at: '2025-11-08T16:00:00Z',
    assigned_to: 'Tom Anderson',
    notes: 'Contract signed! Starting onboarding process next Monday.',
    created_at: '2025-10-28T10:00:00Z',
    updated_at: '2025-11-08T16:00:00Z',
  },
  {
    id: 5,
    name: 'David Martinez',
    phone: '+1-555-0105',
    source: 'call',
    status: 'warm',
    interest_category: 'Analytics Platform',
    last_contact_at: '2025-11-07T13:45:00Z',
    next_followup_at: '2025-11-16T11:00:00Z',
    assigned_to: 'Sarah Johnson',
    notes: 'Comparing our analytics platform with competitors. Price sensitive.',
    created_at: '2025-11-03T14:20:00Z',
    updated_at: '2025-11-07T13:45:00Z',
  },
  {
    id: 6,
    name: 'Jennifer Lee',
    phone: '+1-555-0106',
    source: 'gbp',
    status: 'lost',
    interest_category: 'E-commerce Tools',
    last_contact_at: '2025-11-01T10:30:00Z',
    assigned_to: 'Mike Chen',
    notes: 'Chose competitor due to better integration with their existing stack.',
    created_at: '2025-10-25T11:00:00Z',
    updated_at: '2025-11-01T10:30:00Z',
  },
  {
    id: 7,
    name: 'Robert Taylor',
    phone: '+1-555-0107',
    source: 'instagram',
    status: 'hot',
    interest_category: 'Project Management',
    last_contact_at: '2025-11-11T15:00:00Z',
    next_followup_at: '2025-11-12T09:00:00Z',
    assigned_to: 'Lisa Wang',
    notes: 'Urgent need for project management solution. Budget approved, ready to buy.',
    created_at: '2025-11-10T13:00:00Z',
    updated_at: '2025-11-11T15:00:00Z',
  },
  {
    id: 8,
    name: 'Amanda Garcia',
    phone: '+1-555-0108',
    source: 'manual',
    status: 'new',
    interest_category: 'Customer Support Software',
    last_contact_at: '2025-11-12T08:00:00Z',
    next_followup_at: '2025-11-13T14:00:00Z',
    assigned_to: 'Tom Anderson',
    notes: 'Referral from existing customer. Needs call to discuss requirements.',
    created_at: '2025-11-12T08:00:00Z',
    updated_at: '2025-11-12T08:00:00Z',
  },
];

/**
 * Get all mock leads
 */
export const getMockLeads = (): Lead[] => {
  return [...mockLeads];
};

/**
 * Get mock lead by ID
 */
export const getMockLeadById = (id: number): Lead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

/**
 * Get mock leads by status
 */
export const getMockLeadsByStatus = (status: Lead['status']): Lead[] => {
  return mockLeads.filter(lead => lead.status === status);
};

/**
 * Get mock leads by source
 */
export const getMockLeadsBySource = (source: Lead['source']): Lead[] => {
  return mockLeads.filter(lead => lead.source === source);
};

/**
 * Get mock leads by assigned user
 */
export const getMockLeadsByAssignedTo = (assignedTo: string): Lead[] => {
  return mockLeads.filter(lead => lead.assigned_to === assignedTo);
};

/**
 * Add a new mock lead
 */
export function addMockLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Lead {
  const now = new Date().toISOString();
  const newId = Math.max(...mockLeads.map(l => l.id), 0) + 1;
  
  const newLead: Lead = {
    ...leadData,
    id: newId,
    created_at: now,
    updated_at: now
  };
  
  mockLeads.push(newLead);
  return newLead;
}
