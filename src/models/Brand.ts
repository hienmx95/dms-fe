import { Model } from 'core/models';
import { Moment } from 'moment';
import { Status } from './Status';
import { AppUser } from './AppUser';

export class Brand extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public status?: Status;
  public description?: string;
  public updatedTime?: Moment;
  public appUser?: AppUser;
}
