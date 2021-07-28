import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from './AppUser';
import { Inventory } from './Inventory';

export class InventoryHistory extends Model {
    public id?: number;

    public inventoryId?: number;

    public oldSaleStock?: number;

    public updateTime?: Moment;

    public saleStock?: number;

    public oldAccountingStock?: number;

    public accountingStock?: number;

    public appUserId?: number;

    public appUser?: AppUser;

    public inventory?: Inventory;
}
