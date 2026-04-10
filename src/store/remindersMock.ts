import type { Reminder } from '../types/reminder';

export const mockReminders: Reminder[] = [
  {
    id: 1,
    title: 'Call Test Lead tomorrow',
    description: 'Follow up on gym equipment inquiry',
    due_at: '2025-11-13T10:00:00Z',
    object_type: 'lead',
    object_id: 1,
    priority: 'high',
    repeat: 'none',
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    title: 'Follow up with John Smith for gym setup',
    due_at: '2025-11-13T10:00:00Z',
    object_type: 'lead',
    object_id: 2,
    priority: 'high',
    repeat: 'none',
    created_at: '2025-11-10T14:30:00Z',
    updated_at: '2025-11-10T14:30:00Z',
  },
  {
    id: 3,
    title: 'Send invoice to Emily Davis for gym equipment',
    due_at: '2025-11-15T09:00:00Z',
    object_type: 'sale',
    object_id: 3,
    priority: 'high',
    repeat: 'none',
    created_at: '2025-11-11T14:15:00Z',
    updated_at: '2025-11-11T14:15:00Z',
  },
  {
    id: 4,
    title: 'Project status meeting - XYZ Gym Setup',
    due_at: '2025-11-14T15:00:00Z',
    object_type: 'project',
    object_id: 1,
    priority: 'medium',
    repeat: 'weekly',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-07T15:00:00Z',
  },
  {
    id: 4,
    title: 'Review daily reports',
    due_at: '2025-11-12T17:00:00Z',
    object_type: 'custom',
    object_id: null,
    priority: 'low',
    repeat: 'daily',
    created_at: '2025-11-01T09:00:00Z',
    updated_at: '2025-11-11T17:00:00Z',
  },
  {
    id: 5,
    title: 'Call David Martinez for feedback',
    due_at: '2025-11-16T11:00:00Z',
    object_type: 'lead',
    object_id: 5,
    priority: 'medium',
    repeat: 'none',
    created_at: '2025-11-11T11:45:00Z',
    updated_at: '2025-11-11T11:45:00Z',
  },
];

export const getMockReminders = (): Reminder[] => [...mockReminders];
export const getMockReminderById = (id: number) => mockReminders.find(r => r.id === id);
export const getMockRemindersByObjectType = (type: Reminder['object_type']) => mockReminders.filter(r => r.object_type === type);
export const getMockRemindersByPriority = (priority: Reminder['priority']) => mockReminders.filter(r => r.priority === priority);
export const getMockUpcomingReminders = () => mockReminders.filter(r => new Date(r.due_at) > new Date()).sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());
export const getMockOverdueReminders = () => mockReminders.filter(r => new Date(r.due_at) < new Date());
