import {Model} from 'core/models';
import {Moment} from 'moment';
import {Province} from './Province';
import {Status} from './Status';

export class District extends Model {
  public id?: number;
  public name?: string;
  public code?: string;
  public priority?: number;
  public provinceId?: number;
  public statusId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public province?: Province;
  public status?: Status;
}
