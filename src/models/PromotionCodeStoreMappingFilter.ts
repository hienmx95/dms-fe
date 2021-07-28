import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeStoreMappingFilter extends ModelFilter  {
  public promotionCodeId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
}
