import type { Description, Title } from '#/domains/entities/task/valueObjects';

export type UpdateTaskInputDto = {
  title?: Title;
  description?: Description;
};
