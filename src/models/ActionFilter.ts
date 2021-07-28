import { ModelFilter } from 'core/models';
import { IdFilter, StringFilter } from 'core/filters';

export class ActionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public menuId?: IdFilter = new IdFilter();
}
