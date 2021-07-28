import { Model } from 'core/models';
import { StoreCheckingGroupByDates } from './StoreCheckingGroupByDates';
import { Items } from './Items';
import { Store } from 'models/Store';

export class SaleEmployee extends Model{
    public saleEmployeeId?: number;
    public username?: string;
    public displayName?: string;
    public organizationName?: string;
    public storeCheckingGroupByDates?: StoreCheckingGroupByDates[];
    public items?:  Items;
    public stores?: Store;
}