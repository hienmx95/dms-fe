import { Model } from 'core/models';
import { Permission } from './Permission';
import { Status } from './Status';
import { Menu } from './Menu';
import { AppUserRoleMapping } from './AppUserRoleMapping';
export class Role extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public statusId?: number = 1;
  public status?: Status;
  public permissions?: Permission[];
  public menuId?: number;
  public menu?: Menu;
  public appUserRoleMappings?: AppUserRoleMapping [];
  public appUserRoleMappingId?: number;
}
