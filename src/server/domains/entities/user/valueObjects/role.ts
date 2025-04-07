import { Flags } from '@technote-space/vo-entity-ts';

export type UserRole = 'ADMIN' | 'EDITOR';

export class Role extends Flags<UserRole> {
  protected get symbol(): symbol {
    return Symbol.for('Role');
  }

  public get flagTypes(): UserRole[] {
    return ['ADMIN', 'EDITOR'];
  }

  public isAdmin(): boolean {
    return this.value === 'ADMIN';
  }

  public isEditor(): boolean {
    return this.value === 'EDITOR';
  }
}
