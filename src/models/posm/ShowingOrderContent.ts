import { Model } from 'core/models';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { ShowingItem } from './ShowingItem';
import { ShowingOrder } from './ShowingOrder';

export class ShowingOrderContent extends Model {
  public id?: number;

  public showingOrderId?: number;

  public showingItemId?: number;

  public unitOfMeasureId?: number;

  public salePrice?: number;

  public quantity?: number;

  public amount?: number;

  public showingItem?: ShowingItem;

  public showingOrder?: ShowingOrder;

  public unitOfMeasure?: UnitOfMeasure;
}
