import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeProductMappingFilter extends ModelFilter  {
  public promotionCodeId?: IdFilter = new IdFilter();
  public productId?: IdFilter = new IdFilter();
}
