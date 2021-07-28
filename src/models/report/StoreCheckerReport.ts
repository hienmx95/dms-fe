import { Model } from 'core/models';
import { SaleEmployee } from './SaleEmployee';

export class StoreCheckerReport extends Model{
    organizationName?: string;
    saleEmployees?:  SaleEmployee[];
}