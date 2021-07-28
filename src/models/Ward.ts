import {Model} from 'core/models';
import {Moment} from 'moment';
import {District} from './District';
import {Status} from './Status';

export class Ward extends Model {
  public id?: number;
  public name?: string;
  public code?: string;
  public priority?: number;
  public districtId?: number;
  public statusId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public district?: District;
  public status?: Status;
}
