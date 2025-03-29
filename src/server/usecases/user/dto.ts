import type {
  CreatedAt,
  Id,
  Name,
  UpdatedAt,
} from '#/domains/entities/user/valueObjects';

export type UserOutputDto = {
  id: Id;
  name: Name;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};
