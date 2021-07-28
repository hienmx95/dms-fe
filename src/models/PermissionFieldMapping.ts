import { Model } from 'core/models';
import { Field } from './Field';
import { Permission } from './Permission';

export class PermissionFieldMapping extends Model {
  public permissionId?: number;
  public fieldId?: number;
  public value?: string;
  public field?: Field;
  public permission?: Permission;
}
