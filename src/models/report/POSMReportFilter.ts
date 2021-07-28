import { DateFilter, IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class POSMReportFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public storeTypeId?: IdFilter = new IdFilter();
  public storeGroupingId?: IdFilter = new IdFilter();
  public storeStatusId?: IdFilter = new IdFilter();
  public date?: DateFilter = new DateFilter();

  public showingItemId?: IdFilter = new IdFilter();
}
