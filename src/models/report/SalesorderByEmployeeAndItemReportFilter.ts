import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class SalesOrderByEmployeeAndItemReportFilter extends ModelFilter {
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
  public orderDate?: DateFilter = new DateFilter();
  public itemId?: IdFilter = new IdFilter();
}
