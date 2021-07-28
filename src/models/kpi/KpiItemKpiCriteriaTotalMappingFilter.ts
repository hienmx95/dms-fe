import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiItemKpiCriteriaTotalMappingFilter extends ModelFilter  {
  public kpiItemId?: IdFilter = new IdFilter();
  public kpiCriteriaTotalId?: IdFilter = new IdFilter();
  public value?: NumberFilter = new NumberFilter();
}
