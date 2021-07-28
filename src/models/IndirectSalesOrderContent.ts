import { TaxType } from './TaxType';
import { Model } from 'core/models';
import { IndirectSalesOrder } from './IndirectSalesOrder';
import { UnitOfMeasure } from './UnitOfMeasure';
import { Item } from './Item';

export class IndirectSalesOrderContent extends Model {
    public id?: number;

    public indirectSalesOrderId?: number;

    public itemId?: number;

    public unitOfMeasureId?: number;

    public quantity?: number = 0;

    public primaryUnitOfMeasureId?: number;

    public requestedQuantity?: number = 0;

    public salePrice?: number = 0;

    public discountPercentage?: number = 0;

    public discountAmount?: number;

    public generalDiscountPercentage?: number;

    public generalDiscountAmount?: number;

    public amount?: number = 0.000;

    public taxPercentage?: number;

    public taxAmount?: number;

    public indirectSalesOrder?: IndirectSalesOrder;

    public primaryUnitOfMeasure?: UnitOfMeasure;

    public unitOfMeasure?: UnitOfMeasure;

    public item?: Item;

    public unitPrice?: number = 0;

  public factor?: number = 0;

  public taxType?: TaxType;
  public taxTypeId?: number;
  public primaryPrice?: number = 0;
}
