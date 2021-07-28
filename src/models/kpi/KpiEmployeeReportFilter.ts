import { IdFilter } from 'core/filters';
import { ModelFilter } from '../../core/models';

export class KpiEmployeeReportFilter extends ModelFilter {
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  // public kpiPeriod?: DateFilter = new DateFilter();
  public kpiPeriodId?: IdFilter = new IdFilter();
  // public kpiYear?: DateFilter = new DateFilter();
  public kpiYearId?: IdFilter = new IdFilter();
}