export type ProjectStage = 'planning' | 'active' | 'hold' | 'closed';

export interface Project {
  id: number;
  title: string;
  client: string;
  stage: ProjectStage;
  start_date: string;
  due_date?: string | null;
  members: string[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  title: string;
  client: string;
  stage?: ProjectStage;
  start_date: string;
  due_date?: string | null;
  members?: string[];
  notes?: string | null;
}

export interface UpdateProjectInput {
  title?: string;
  client?: string;
  stage?: ProjectStage;
  start_date?: string;
  due_date?: string | null;
  members?: string[];
  notes?: string | null;
}
