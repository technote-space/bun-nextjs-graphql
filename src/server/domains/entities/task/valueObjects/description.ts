import { Text } from '@technote-space/vo-entity-ts';

export class Description extends Text {
  protected get symbol() {
    return Symbol();
  }
}
