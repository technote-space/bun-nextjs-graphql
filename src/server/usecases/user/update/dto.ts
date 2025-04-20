import type {
  Role,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';

export type UpdateUserInputDto = Readonly<{
  name?: UserName;
  email?: UserEmail;
  role?: Role;
}>;
