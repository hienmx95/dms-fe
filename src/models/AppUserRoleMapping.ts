import { Model } from 'core/models';
import { AppUser } from './AppUser';
import { Role } from './Role';

export class AppUserRoleMapping extends Model {
  public appUserId?: number;
  public roleId?: number;
  public appUser?: AppUser;
  public role?: Role;
}
