import { Model } from 'core/models';
import { IndirectSalesOrder } from './IndirectSalesOrder';
import { Item } from './Item';
import { UnitOfMeasure } from './UnitOfMeasure';

export class IndirectSalesOrderPromotion extends Model {
  public id?: number;

  public indirectSalesOrderId?: number;

  public itemId?: number;

  public unitOfMeasureId?: number;

  public quantity?: number = 0;

  public primaryUnitOfMeasureId?: number;

  public requestedQuantity?: number = 0;

  public note?: string;

  public indirectSalesOrder?: IndirectSalesOrder;

  public item?: Item;

  public primaryUnitOfMeasure?: UnitOfMeasure;

  public unitOfMeasure?: UnitOfMeasure;
}
