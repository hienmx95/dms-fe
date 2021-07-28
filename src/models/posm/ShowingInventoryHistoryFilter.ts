import { DateFilter, IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ShowingInventoryHistoryFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public showingInventoryId?: IdFilter = new IdFilter();
  public oldSaleStock?: NumberFilter = new NumberFilter();
  public saleStock?: NumberFilter = new NumberFilter();
  public oldAccountingStock?: NumberFilter = new NumberFilter();
  public accountingStock?: NumberFilter = new NumberFilter();
  public appUserId?: IdFilter = new IdFilter();
  public updateTime?: DateFilter = new DateFilter();
}
