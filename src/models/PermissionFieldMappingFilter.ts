import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PermissionFieldMappingFilter extends ModelFilter {
  public permissionId?: IdFilter = new IdFilter();
  public fieldId?: IdFilter = new IdFilter();
  public value?: StringFilter = new StringFilter();
}
