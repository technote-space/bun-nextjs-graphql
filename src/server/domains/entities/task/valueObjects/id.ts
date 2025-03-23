import { StringId } from '@technote-space/vo-entity-ts';

export class Id extends StringId {
  protected get symbol() {
    return Symbol();
  }
}
