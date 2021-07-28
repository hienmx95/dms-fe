import { Model } from 'core/models';
import { Store } from './Store';

export class DirectSalesOrderByStoreAndItemsReport extends Model{
    organizationName?: string;
    stores?: Store;
}