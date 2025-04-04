import { Text } from '@technote-space/vo-entity-ts';

export class UserName extends Text {
  protected get symbol() {
    return Symbol();
  }
}
