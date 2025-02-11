import { createUser } from './create';
import { deleteUser } from './delete';
import { updateUser } from './update';

export const User = {
  ...createUser,
  ...updateUser,
  ...deleteUser,
};
