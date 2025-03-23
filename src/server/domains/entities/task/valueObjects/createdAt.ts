import { DateObject } from '@technote-space/vo-entity-ts';

export class CreatedAt extends DateObject {
  protected get symbol() {
    return Symbol();
  }
}
