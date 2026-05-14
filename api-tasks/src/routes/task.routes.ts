import { Router } from 'express';
import * as TC from '../controllers/task.controller';
import { authMiddleware }  from '../middleware/auth.middleware';
import { validateBody }    from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

export const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter
  .route('/')
  .get(TC.getAllTasks)
  .post(validateBody(createTaskSchema), TC.createTask);

taskRouter
  .route('/:id')
  .get(TC.getTaskById)
  .patch(validateBody(updateTaskSchema), TC.updateTask)
  .delete(TC.deleteTask);