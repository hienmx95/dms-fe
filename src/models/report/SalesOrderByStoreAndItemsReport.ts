import { Model } from 'core/models';
import { Store } from './Store';

export class SalesOrderByStoreAndItemsReport extends Model{
    organizationName?: string;
    stores?: Store;
}