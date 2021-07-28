
import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PermissionContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public FieldId?: IdFilter = new IdFilter();
  public value?: StringFilter = new StringFilter();

}
