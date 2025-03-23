import { Exception } from './exception';

export class Unexpected extends Exception {
  public constructor() {
    super(500, '予期せぬエラーです');
  }
}
