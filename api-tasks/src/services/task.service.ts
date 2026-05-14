import { supabase } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import type { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

export class TaskService {

  async findAll(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(500, error.message);
    return data ?? [];
  }

  async findById(id: string, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new AppError(404, 'Tarea no encontrada');
    return data;
  }

  async create(dto: CreateTaskDTO, userId: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return data!;
  }

  async update(id: string, dto: UpdateTaskDTO, userId: string): Promise<Task> {
    await this.findById(id, userId);

    const { data, error } = await supabase
      .from('tasks')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(400, error.message);
    return data!;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw new AppError(500, error.message);
  }
}