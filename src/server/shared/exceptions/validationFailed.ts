import { Exception } from './exception';

export type ValidationErrors = Readonly<{
  [name: string]: string[];
}>;

export class ValidationFailed extends Exception {
  public constructor(public readonly errors?: ValidationErrors) {
    super(422, 'バリデーションエラーが発生しました', errors);
  }
}
