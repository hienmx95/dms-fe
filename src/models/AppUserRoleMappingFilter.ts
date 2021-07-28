import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class AppUserRoleMappingFilter extends ModelFilter {
  public appUserId?: IdFilter = new IdFilter();
  public roleId?: IdFilter = new IdFilter();
}
