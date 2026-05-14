export interface Task {
  id:          string;
  title:       string;
  description: string | null;
  completed:   boolean;
  priority:    'low' | 'medium' | 'high';
  user_id:     string;
  created_at:  string;
  updated_at:  string;
}

export type CreateTaskDTO = Pick<Task, 'title' | 'description' | 'priority'>;
export type UpdateTaskDTO = Partial<CreateTaskDTO & { completed: boolean }>;

export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  message?: string;
  count?:  number;
}