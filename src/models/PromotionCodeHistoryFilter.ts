import { IdFilter, GuidFilter, StringFilter } from 'core/filters';
import { DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeHistoryFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public promotionCodeId?: IdFilter = new IdFilter();
  public appliedAt?: DateFilter = new DateFilter();
  public rowId?: GuidFilter = new GuidFilter();
  public storeCode?: StringFilter = new StringFilter();
  public storeName?: StringFilter = new StringFilter();
  public storeAddress?: StringFilter = new StringFilter();
  public code?: StringFilter = new StringFilter();
}
