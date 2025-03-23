import { DateObject } from '@technote-space/vo-entity-ts';

export class UpdatedAt extends DateObject {
  protected get symbol() {
    return Symbol();
  }
}
