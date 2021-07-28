import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiItemContentKpiCriteriaItemMappingFilter extends ModelFilter  {
  public kpiItemContentId?: IdFilter = new IdFilter();
  public kpiCriteriaItemId?: IdFilter = new IdFilter();
  public value?: NumberFilter = new NumberFilter();
}
