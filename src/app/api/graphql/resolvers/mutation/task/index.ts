import { completeTask } from './complete';
import { createTask } from './create';
import { deleteTask } from './delete';
import { updateTask } from './update';

export const Task = {
  ...createTask,
  ...updateTask,
  ...completeTask,
  ...deleteTask,
};
