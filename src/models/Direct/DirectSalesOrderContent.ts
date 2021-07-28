import { TaxType } from 'models/TaxType';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { Item } from 'models/Item';
import { DirectSalesOrder } from './DirectSalesOrder';
import { Model } from 'core/models';

export class DirectSalesOrderContent extends Model {
  public id?: number;

  public directSalesOrderId?: number;

  public itemId?: number;

  public unitOfMeasureId?: number;

  public quantity?: number = 0;

  public primaryUnitOfMeasureId?: number;

  public requestedQuantity?: number = 0;

  public primaryPrice?: number = 0;

  public salePrice?: number = 0;

  public discountPercentage?: number = 0;

  public discountAmount?: number = 0;

  public generalDiscountPercentage?: number;

  public generalDiscountAmount?: number;

  public taxPercentage?: number;

  public taxAmount?: number;

  public amount?: number = 0;

  public factor?: number = 0;

  public directSalesOrder?: DirectSalesOrder;

  public item?: Item;

  public primaryUnitOfMeasure?: UnitOfMeasure;

  public unitOfMeasure?: UnitOfMeasure;
  public unitPrice?: number = 0;
  public taxType?: TaxType;
  public taxTypeId?: number;
}
