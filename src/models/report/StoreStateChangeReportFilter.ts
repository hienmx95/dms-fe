import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter, StringFilter } from 'core/filters';

export class StoreStateChangeReportFilter extends ModelFilter {
  public organizationId?: IdFilter = new IdFilter();

  public storeId?: IdFilter = new IdFilter();

  public storeTypeId?: IdFilter = new IdFilter();

  public createdAt?: DateFilter = new DateFilter();

  public storeStatusId?: IdFilter = new IdFilter();

  public storeAddress?: StringFilter = new StringFilter();

  public previousStoreStatusId?: IdFilter = new IdFilter();
}
