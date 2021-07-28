import { IdFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiItemsReportFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public kpiYearId?: IdFilter = new IdFilter();
  public kpiPeriodId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public employeeId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  // public saleEmployeeId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public kpiItemTypeId?: IdFilter = new IdFilter();
}
