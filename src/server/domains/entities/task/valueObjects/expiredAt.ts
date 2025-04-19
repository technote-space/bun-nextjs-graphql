import { DateObject } from '@technote-space/vo-entity-ts';

export class ExpiredAt extends DateObject<true> {
  protected get symbol() {
    return Symbol();
  }
}
