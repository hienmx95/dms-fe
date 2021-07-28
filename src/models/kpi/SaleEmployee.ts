import { Model } from '../../core/models';
import { ItemContents } from './ItemContents';
export class SaleEmployee extends Model {
  public saleEmployeeId?: number;
  public userName?: string;
  public displayName?: string;
  public organizationName?: string;
  public organizationId?: number;
  public totalIndirectOrders?: number;
  public totalIndirectOrdersPLanned?: number;
  public totalIndirectOrdersRatio?: number;
  public totalIndirectQuantity?: number;
  public totalIndirectQuantityPlanned?: number;
  public totalIndirectQuantityRatio?: number;
  public totalIndirectSalesAmount?: number;
  public totalIndirectSalesAmountPlanned?: number;
  public totalIndirectSalesAmountRatio?: number;
  public skuIndirectOrder?: number;
  public skuIndirectOrderPlanned?: number;
  public skuIndirectOrderRatio?: number;
  public storesVisited?: number;
  public storesVisitedPLanned?: number;
  public storesVisitedRatio?: number;
  public newStoreCreated?: number;
  public newStoreCreatedPlanned?: number;
  public newStoreCreatedRatio?: number;
  public numberOfStoreVisits?: number;
  public numberOfStoreVisitsPlanned?: number;
  public numberOfStoreVisitsRatio?: number;
  public itemContents?: ItemContents;
  public contents?: ItemContents;
}
