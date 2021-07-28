import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { Model } from 'core/models';
import { Moment } from 'moment';
import { PromotionCode } from './PromotionCode';

export class PromotionCodeHistory extends Model {
  public id?: number;

  public promotionCodeId?: number;

  public appliedAt?: Moment;

  public rowId?: string;

  public promotionCode?: PromotionCode;

  public directSalesOrder?: DirectSalesOrder;
}
