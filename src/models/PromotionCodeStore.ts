import { Model } from 'core/models';
import { PromotionCode } from './PromotionCode';
import { Store } from './Store';

export class PromotionCodeStore extends Model {
  public promotionCodeId?: number;

  public storeId?: number;

  public promotionCode?: PromotionCode;

  public store?: Store;
}
