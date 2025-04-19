import type {
  Description,
  ExpiredAt,
  Title,
} from '#/domains/entities/task/valueObjects';

export type UpdateTaskInputDto = {
  title?: Title;
  description?: Description;
  expiredAt?: ExpiredAt;
};
