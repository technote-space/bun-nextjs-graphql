import type { UserEmail, UserName } from '#/domains/entities/user/valueObjects';

export type UpdateUserInputDto = {
  name?: UserName;
  email?: UserEmail;
};
