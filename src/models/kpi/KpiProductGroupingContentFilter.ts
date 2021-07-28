import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiProductGroupingContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public kpiProductGroupingId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
}
