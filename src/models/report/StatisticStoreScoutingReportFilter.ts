import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class StatisticStoreScoutingReportFilter extends ModelFilter{
  public wardId?: IdFilter = new IdFilter();
  public provinceId?: IdFilter = new IdFilter();
  public districtId?: IdFilter = new IdFilter();
    public date?: DateFilter = new DateFilter();
}
