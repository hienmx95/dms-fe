import { Model } from 'core/models';
import { Action } from './Action';
import { Permission } from './Permission';

export class PermissionActionMapping extends Model {
  public actionId?: number;
  public permissionId?: number;
  public action?: Action;
  public permission?: Permission;
}
