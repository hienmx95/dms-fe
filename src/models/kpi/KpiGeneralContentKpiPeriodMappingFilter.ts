import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiGeneralContentKpiPeriodMappingFilter extends ModelFilter  {
  public kpiGeneralContentId?: IdFilter = new IdFilter();
  public kpiPeriodId?: IdFilter = new IdFilter();
  public value?: NumberFilter = new NumberFilter();
}
