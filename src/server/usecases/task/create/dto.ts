import type {
  Description,
  ExpiredAt,
  Title,
} from '#/domains/entities/task/valueObjects';

export type CreateTaskInputDto = {
  title: Title;
  description: Description;
  expiredAt?: ExpiredAt;
};
