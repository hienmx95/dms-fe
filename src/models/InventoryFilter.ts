import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class InventoryFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public warehouseId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public itemCode?: StringFilter = new StringFilter();
  public itemName?: StringFilter = new StringFilter();
  public saleStock?: NumberFilter = new NumberFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public accountingStock?: NumberFilter = new NumberFilter();
}
