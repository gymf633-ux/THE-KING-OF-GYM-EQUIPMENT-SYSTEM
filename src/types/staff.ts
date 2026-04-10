export type StaffRole = 'owner' | 'admin' | 'sales' | 'support' | 'viewer';

export interface Staff {
  id: number;
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateStaffInput {
  name: string;
  role: StaffRole;
  phone: string;
  email: string;
  permissions?: string[];
}

export interface UpdateStaffInput {
  name?: string;
  role?: StaffRole;
  phone?: string;
  email?: string;
  permissions?: string[];
}
