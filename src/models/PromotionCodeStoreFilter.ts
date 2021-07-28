import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeStoreFilter extends ModelFilter  {
  public promotionCodeId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
}
