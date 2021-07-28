import { Model } from 'core/models';
import { Status } from './Status';

export class StoreScoutingType extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public statusId?: number = 1;
  public status?: Status;

}