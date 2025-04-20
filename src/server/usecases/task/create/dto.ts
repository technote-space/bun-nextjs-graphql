import type {
  Description,
  ExpiredAt,
  Title,
} from '#/domains/entities/task/valueObjects';

export type CreateTaskInputDto = Readonly<{
  title: Title;
  description: Description;
  expiredAt?: ExpiredAt;
}>;
