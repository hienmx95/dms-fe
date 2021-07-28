import { Model } from 'core/models';

export class Action extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public menuId?: string;
  public isDeleted?: boolean;
}
