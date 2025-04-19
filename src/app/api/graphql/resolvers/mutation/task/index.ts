import { completeTask } from './complete';
import { createTask } from './create';
import { deleteTask } from './delete';
import { startTask } from './start';
import { updateTask } from './update';

export const Task = {
  ...createTask,
  ...updateTask,
  ...startTask,
  ...completeTask,
  ...deleteTask,
};
