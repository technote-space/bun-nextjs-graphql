import { DateObject } from '@technote-space/vo-entity-ts';

export class StartedAt extends DateObject<true> {
  protected get symbol() {
    return Symbol();
  }
}
