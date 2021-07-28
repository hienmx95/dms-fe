import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ItemsFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public productTypeId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
}