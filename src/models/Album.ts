import { Model } from 'core/models';
import { Status } from './Status';

export class Album extends Model {
  public id?: number;
  public name?: string;
  public status?: Status;
  public statusId?: number = 1;
}
