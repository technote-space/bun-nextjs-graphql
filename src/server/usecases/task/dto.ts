import type {
  CompletedAt,
  CreatedAt,
  Description,
  ExpiredAt,
  Id,
  StartedAt,
  Status,
  Title,
  UpdatedAt,
} from '#/domains/entities/task/valueObjects';
import type { Id as UserId } from '#/domains/entities/user/valueObjects';

export type TaskOutputDto = {
  id: Id;
  userId: UserId;
  title: Title;
  description: Description;
  completedAt: CompletedAt;
  startedAt: StartedAt;
  expiredAt: ExpiredAt;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  status: Status;
};
