import { ModelFilter } from 'core/models';
import { IdFilter } from 'core/filters';

export class PermissionActionMappingFilter extends ModelFilter {
  public actionId?: IdFilter = new IdFilter();
  public permissionId?: IdFilter = new IdFilter();
}
