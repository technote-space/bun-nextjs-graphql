import type { Description, Title } from '#/domains/entities/task/valueObjects';

export type CreateTaskInputDto = {
  title: Title;
  description: Description;
};
