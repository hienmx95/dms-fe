import { ModelFilter } from 'core/models';
import { IdFilter, StringFilter } from 'core/filters';
export class EnumListFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
}
