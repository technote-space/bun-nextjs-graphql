import { Text } from '@technote-space/vo-entity-ts';

export class SsoId extends Text<true> {
  protected get symbol() {
    return Symbol();
  }
}
