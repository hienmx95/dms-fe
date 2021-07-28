import { Model } from '../../core/models';
import { SaleEmployee } from './SaleEmployee';
export class KpiProductGroupingsReport extends Model {
  public organizationId?: number;
  public organizationName?: string;
  public saleEmployees?: SaleEmployee[];
}
