import type {
  CreatedAt,
  Id,
  Role,
  UpdatedAt,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';

export type UserOutputDto = Readonly<{
  id: Id;
  name: UserName;
  email: UserEmail;
  role: Role;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
}>;
