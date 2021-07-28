import {
  DateFilter,
  GuidFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from 'core/filters';
import { ModelFilter } from 'core/models';

export class ShowingOrderWithdrawFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public appUserId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public date?: DateFilter = new DateFilter();
  public showingWarehouseId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public total?: NumberFilter = new NumberFilter();
  public rowId?: GuidFilter = new GuidFilter();
  public storeId?: IdFilter = new IdFilter();
  public showingItemId?: IdFilter = new IdFilter();
}
