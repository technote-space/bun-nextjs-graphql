import type {
  CompletedAt,
  CreatedAt,
  Description,
  Id,
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
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  status: Status;
};
