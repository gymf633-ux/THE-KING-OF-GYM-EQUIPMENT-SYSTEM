import type { Project } from '../types/project';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'New Gym Setup for XYZ',
    client: 'XYZ Fitness Center',
    stage: 'planning',
    start_date: '2025-11-15T00:00:00Z',
    due_date: '2025-12-30T00:00:00Z',
    members: ['Sarah Johnson', 'Mike Chen'],
    notes: 'Complete gym equipment installation for new fitness center. Includes power racks, cardio equipment, and flooring.',
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    title: 'Home Gym Setup - Premium Package',
    client: 'John Smith',
    stage: 'active',
    start_date: '2025-11-01T00:00:00Z',
    due_date: '2025-11-20T00:00:00Z',
    members: ['Sarah Johnson', 'Lisa Wang'],
    notes: 'Home gym setup with power rack, benches, and cardio equipment. Installation in progress.',
    created_at: '2025-10-28T10:00:00Z',
    updated_at: '2025-11-10T14:30:00Z',
  },
  {
    id: 3,
    title: 'Commercial Gym Equipment Upgrade',
    client: 'FitLife Gym Chain',
    stage: 'planning',
    start_date: '2025-11-20T00:00:00Z',
    due_date: '2026-01-31T00:00:00Z',
    members: ['Tom Anderson', 'Sarah Johnson'],
    notes: 'Equipment upgrade for 3 locations. Waiting for final equipment selection.',
    created_at: '2025-11-05T09:00:00Z',
    updated_at: '2025-11-08T16:00:00Z',
  },
  {
    id: 4,
    title: 'Playground Equipment Installation',
    client: 'GrowFast Inc',
    stage: 'active',
    start_date: '2025-10-15T00:00:00Z',
    due_date: '2025-11-30T00:00:00Z',
    members: ['Mike Chen', 'Tom Anderson'],
    notes: 'Setting up email campaigns and automation workflows.',
    created_at: '2025-10-14T11:30:00Z',
    updated_at: '2025-11-11T10:00:00Z',
  },
  {
    id: 4,
    title: 'Mobile App Development',
    client: 'RetailPro Ltd',
    stage: 'hold',
    start_date: '2025-09-01T00:00:00Z',
    due_date: null,
    members: ['Lisa Wang'],
    notes: 'On hold pending budget approval from client.',
    created_at: '2025-08-25T14:00:00Z',
    updated_at: '2025-10-20T09:00:00Z',
  },
  {
    id: 5,
    title: 'Analytics Dashboard',
    client: 'DataViz Co',
    stage: 'closed',
    start_date: '2025-08-01T00:00:00Z',
    due_date: '2025-10-31T00:00:00Z',
    members: ['Sarah Johnson', 'Mike Chen', 'Tom Anderson'],
    notes: 'Successfully completed. Client very satisfied.',
    created_at: '2025-07-28T10:00:00Z',
    updated_at: '2025-11-01T15:00:00Z',
  },
];

export const getMockProjects = (): Project[] => [...mockProjects];
export const getMockProjectById = (id: number) => mockProjects.find(p => p.id === id);
export const getMockProjectsByStage = (stage: Project['stage']) => mockProjects.filter(p => p.stage === stage);
export const getMockProjectsByClient = (client: string) => mockProjects.filter(p => p.client.toLowerCase().includes(client.toLowerCase()));
export const getMockActiveProjects = () => mockProjects.filter(p => p.stage === 'active');
