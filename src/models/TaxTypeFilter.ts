import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class TaxTypeFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public percentage?: NumberFilter = new NumberFilter();
  public statusId?: IdFilter = new IdFilter();
}
