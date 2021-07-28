import { Model } from 'core/models';
import { Moment } from 'moment';
import { Status } from './Status';
import { Store } from './Store';
import { AppUser } from './AppUser';

export class Organization extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public parentId?: number;
  public path?: string;
  public level?: number;
  public statusId?: number = 1;
  public isDisplay?: boolean = true;
  public phone?: string;
  public address?: string;
  public latitude?: number;
  public longitude?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public parent?: Organization;
  public status?: Status;
  public stores?: Store[];
  public appUsers?: AppUser[];
  public filterType?: number;
}
