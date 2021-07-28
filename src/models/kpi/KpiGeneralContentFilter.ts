import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiGeneralContentFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public kpiGeneralId?: IdFilter = new IdFilter();
  public kpiCriteriaGeneralId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
}
