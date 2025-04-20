import type {
  Description,
  ExpiredAt,
  Title,
} from '#/domains/entities/task/valueObjects';

export type UpdateTaskInputDto = Readonly<{
  title?: Title;
  description?: Description;
  expiredAt?: ExpiredAt;
}>;
