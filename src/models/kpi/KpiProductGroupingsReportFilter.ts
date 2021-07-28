import { IdFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class KpiProductGroupingsReportFilter extends ModelFilter {
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
  public productGroupingId?: IdFilter = new IdFilter();
  public kpiProductGroupingTypeId?: IdFilter = new IdFilter();
}
