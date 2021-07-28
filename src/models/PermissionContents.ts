import { Model } from 'core/models';
import { Field } from './Field';
import { PermissionOperator } from './PermissionOperator';
import { Moment } from 'moment';
export class PermissionContent extends Model {
  public id?: number;
  public permissionId: number;
  public fieldId?: number;
  public permissionOperatorId: number;
  public value: string | number | Moment | undefined;
  public field?: Field;
  public permissionOperator: PermissionOperator;
}
