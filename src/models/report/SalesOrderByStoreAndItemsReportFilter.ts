import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class SalesOrderByStoreAndItemsReportFilter extends ModelFilter {
  // public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public storeTypeId?: IdFilter = new IdFilter();
  public storeGroupingId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
  public orderDate?: DateFilter = new DateFilter();
  public storeStatusId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
}
