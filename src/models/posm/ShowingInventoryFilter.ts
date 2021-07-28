import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ShowingInventoryFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public showingWarehouseId?: IdFilter = new IdFilter();
  public showingItemId?: IdFilter = new IdFilter();
  public saleStock?: NumberFilter = new NumberFilter();
  public accountingStock?: NumberFilter = new NumberFilter();
  public appUserId?: IdFilter = new IdFilter();
}
