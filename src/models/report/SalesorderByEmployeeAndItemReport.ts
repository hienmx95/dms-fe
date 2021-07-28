import { Model } from 'core/models';
import { SaleEmployee } from './SaleEmployee';

export class SalesOrderByEmployeeAndItemReport extends Model{
    public organizationName?: string;
    public employees?: SaleEmployee;
}