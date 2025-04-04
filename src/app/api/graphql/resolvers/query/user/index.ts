import { me } from './me';
import { user } from './user';
import { users } from './users';

export const User = {
  ...me,
  ...user,
  ...users,
};
