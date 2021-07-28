import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { Item } from 'models/Item';
import { DirectSalesOrder } from './DirectSalesOrder';
import { Model } from 'core/models';

export class DirectSalesOrderPromotion extends Model
{
    public id?: number;

    public directSalesOrderId?: number;

    public itemId?: number;

    public unitOfMeasureId?: number;

    public quantity?: number;

    public primaryUnitOfMeasureId?: number;

    public requestedQuantity?: number;

    public note?: string;

    public factor?: number;


    public directSalesOrder?: DirectSalesOrder;

    public item?: Item;

    public primaryUnitOfMeasure?: UnitOfMeasure;

    public unitOfMeasure?: UnitOfMeasure;
}
