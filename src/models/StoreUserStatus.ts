import { Model } from 'core/models';

export class StoreUserStatus extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public value?: string;
}
