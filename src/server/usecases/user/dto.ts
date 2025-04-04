import type {
  CreatedAt,
  Id,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';

export type UserOutputDto = {
  id: Id;
  name: UserName;
  email: UserEmail;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};
