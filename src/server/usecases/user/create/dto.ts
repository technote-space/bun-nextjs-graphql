import type { UserEmail, UserName } from '#/domains/entities/user/valueObjects';

export type CreateUserInputDto = {
  name: UserName;
  email: UserEmail;
};
