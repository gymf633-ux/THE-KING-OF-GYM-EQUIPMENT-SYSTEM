import type { Staff } from '../types/staff';

export const mockStaff: Staff[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'owner',
    phone: '+1-555-1001',
    email: 'sarah@company.com',
    permissions: ['all'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-11-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'admin',
    phone: '+1-555-1002',
    email: 'mike@company.com',
    permissions: ['leads', 'sales', 'campaigns', 'settings'],
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-10-20T14:00:00Z',
  },
  {
    id: 3,
    name: 'Lisa Wang',
    role: 'sales',
    phone: '+1-555-1003',
    email: 'lisa@company.com',
    permissions: ['leads', 'sales', 'campaigns'],
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-11-05T09:00:00Z',
  },
  {
    id: 4,
    name: 'Tom Anderson',
    role: 'support',
    phone: '+1-555-1004',
    email: 'tom@company.com',
    permissions: ['reviews', 'gbp', 'projects'],
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-10-30T16:00:00Z',
  },
  {
    id: 5,
    name: 'Emily Roberts',
    role: 'viewer',
    phone: '+1-555-1005',
    email: 'emily@company.com',
    permissions: ['dashboard', 'reports'],
    created_at: '2025-05-15T00:00:00Z',
    updated_at: '2025-11-01T08:00:00Z',
  },
];

export const getMockStaff = (): Staff[] => [...mockStaff];
export const getMockStaffById = (id: number) => mockStaff.find(s => s.id === id);
export const getMockStaffByRole = (role: Staff['role']) => mockStaff.filter(s => s.role === role);
export const getMockStaffByEmail = (email: string) => mockStaff.find(s => s.email.toLowerCase() === email.toLowerCase());
export const getMockStaffWithPermission = (permission: string) => mockStaff.filter(s => s.permissions.includes(permission) || s.permissions.includes('all'));
