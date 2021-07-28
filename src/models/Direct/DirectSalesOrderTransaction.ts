import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { Organization } from 'models/Organization';
import { Item } from 'models/Item';
import { DirectSalesOrder } from './DirectSalesOrder';
import { Model } from 'core/models';

export class DirectSalesOrderTransaction extends Model
{
    public id?: number;

    public directSalesOrderId?: number;

    public organizationId?: number;

    public itemId?: number;

    public unitOfMeasureId?: number;

    public quantity?: number;

    public discount?: number;

    public revenue?: number;

    public typeId?: number;


    public directSalesOrder?: DirectSalesOrder;

    public item?: Item;

    public organization?: Organization;

    public unitOfMeasure?: UnitOfMeasure;
}
