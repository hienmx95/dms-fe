import { Model } from 'core/models';
import { Moment } from 'moment';
import { Status } from './Status';

export class ProductType extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public description?: string;
  public statusId?: number = 1;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public status?: Status;
  public updatedTime?: Moment;
}
