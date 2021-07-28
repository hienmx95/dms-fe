import { Model } from '../../core/models';
import { SaleEmployee } from './SaleEmployee';
export class KpiPeriodReport extends Model {
    public organizationName?: string;
    public saleEmployees?: SaleEmployee;
}