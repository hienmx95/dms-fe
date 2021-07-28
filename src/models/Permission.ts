import { Model } from 'core/models';
import { Menu } from './Menu';
import { PermissionFieldMapping } from './PermissionFieldMapping';
import { PermissionPageMapping } from './PermissionPageMapping';
import { Role } from './Role';
import { Status } from './Status';
import { PermissionContent } from './PermissionContents';

export class Permission extends Model {
  public id?: number;
  public name?: string;
  public roleId?: number;
  public menuId?: number;
  public statusId?: number;
  public menu?: Menu;
  public role?: Role;
  public status?: Status;
  public permissionFieldMappings?: PermissionFieldMapping[];
  public permissionPageMappings?: PermissionPageMapping[];
  public permissionContents?: PermissionContent[];
}
