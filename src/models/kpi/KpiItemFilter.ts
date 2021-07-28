import { IdFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiItemFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public kpiYearId?: IdFilter = new IdFilter();
  public kpiPeriodId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public kpiItemTypeId?: IdFilter = new IdFilter();
}
