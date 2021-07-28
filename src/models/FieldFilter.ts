import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class FieldFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public type?: StringFilter = new StringFilter();
  public menuId?: IdFilter = new IdFilter();
}
