import { ShowingOrderWithdraw } from './ShowingOrderWithdraw';
import { Model } from 'core/models';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { ShowingItem } from './ShowingItem';

export class ShowingOrderWithdrawContent extends Model {
  public id?: number;

  public showingOrderId?: number;

  public showingItemId?: number;

  public unitOfMeasureId?: number;

  public salePrice?: number;

  public quantity?: number;

  public amount?: number;

  public showingItem?: ShowingItem;

  public showingOrder?: ShowingOrderWithdraw;

  public unitOfMeasure?: UnitOfMeasure;
}
