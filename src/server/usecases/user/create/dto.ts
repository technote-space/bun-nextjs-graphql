import type {
  Role,
  UserEmail,
  UserName,
} from '#/domains/entities/user/valueObjects';

export type CreateUserInputDto = {
  name: UserName;
  email: UserEmail;
  role: Role;
};
