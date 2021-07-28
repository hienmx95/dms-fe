import { Model } from 'core/models';
import { Product } from './Product';
import { PromotionCode } from './PromotionCode';

export class PromotionCodeProductMapping extends Model {
  public promotionCodeId?: number;

  public productId?: number;

  public product?: Product;

  public promotionCode?: PromotionCode;
}
