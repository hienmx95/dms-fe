import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiItemContentFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public kpiItemId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
}
