export type ObjectType = 'lead' | 'sale' | 'project' | 'custom';
export type Priority = 'low' | 'medium' | 'high';
export type RepeatType = 'none' | 'daily' | 'weekly';

export interface Reminder {
  id: number;
  title: string;
  due_at: string;
  object_type: ObjectType;
  object_id?: number | null;
  priority: Priority;
  repeat: RepeatType;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderInput {
  title: string;
  due_at: string;
  object_type: ObjectType;
  object_id?: number | null;
  priority?: Priority;
  repeat?: RepeatType;
}

export interface UpdateReminderInput {
  title?: string;
  due_at?: string;
  object_type?: ObjectType;
  object_id?: number | null;
  priority?: Priority;
  repeat?: RepeatType;
}
