import { Flags } from '@technote-space/vo-entity-ts';

export type TaskStatus = 'Planned' | 'InProgress' | 'Completed' | 'Expired';

export class Status extends Flags<TaskStatus> {
  protected get symbol() {
    return Symbol();
  }

  get flagTypes(): TaskStatus[] {
    return ['Planned', 'InProgress', 'Completed', 'Expired'];
  }
}
