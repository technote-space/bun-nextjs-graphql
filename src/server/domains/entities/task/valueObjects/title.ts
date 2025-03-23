import { Text } from '@technote-space/vo-entity-ts';

export class Title extends Text {
  protected get symbol() {
    return Symbol();
  }
}
