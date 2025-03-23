import { Text } from '@technote-space/vo-entity-ts';

export class Name extends Text {
  protected get symbol() {
    return Symbol();
  }
}
