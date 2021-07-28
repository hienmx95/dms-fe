import { Model } from 'core/models';
import { SaleEmployee } from './SaleEmployee';

export class StoreUnCheckedReport extends Model{
    organizationName?: string;
    saleEmployees?:  SaleEmployee;
}