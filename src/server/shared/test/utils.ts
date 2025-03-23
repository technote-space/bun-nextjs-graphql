import {
  defineTaskFactory,
  defineUserFactory,
} from '#/frameworks/database/prisma/fabbrica';

export const userFactory = defineUserFactory();
export const taskFactory = defineTaskFactory({
  defaultData: {
    user: userFactory,
  },
});
