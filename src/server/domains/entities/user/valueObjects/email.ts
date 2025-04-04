import { Email } from '@technote-space/vo-entity-ts';

export class UserEmail extends Email {
  protected get symbol() {
    return Symbol();
  }
}
