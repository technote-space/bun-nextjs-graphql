import { DateObject } from '@technote-space/vo-entity-ts';

export class CompletedAt extends DateObject<true> {
  protected get symbol() {
    return Symbol();
  }
}
