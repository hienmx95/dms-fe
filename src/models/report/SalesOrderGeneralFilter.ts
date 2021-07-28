import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class SalesOrderGeneralReportFilter extends ModelFilter {
  // public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public buyerStoreId?: IdFilter = new IdFilter();
  public sellerStoreId?: IdFilter = new IdFilter();
  public orderDate?: DateFilter = new DateFilter();
  public storeStatusId?: IdFilter = new IdFilter();
}
