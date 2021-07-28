import { Model } from 'core/models';
import { Moment } from 'moment';

export class Nation extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public statusId?: number = 1;
  public displayOrder?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
}
