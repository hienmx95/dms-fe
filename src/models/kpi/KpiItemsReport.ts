import { Model } from '../../core/models';
import { SaleEmployee } from './SaleEmployee';
export class KpiItemsReport extends Model {
    public organizationName?: string;
    public displayName?: string;
    public userName?: string;
    public saleEmployees?: SaleEmployee;
}