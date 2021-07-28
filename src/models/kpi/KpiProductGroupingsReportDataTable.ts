import { Model } from 'core/models';

export class KpiProductGroupingsReportDataTable extends Model {
  public title?: string;
  public userName?: string;
  public displayName?: string;
  public rowSpan?: number = 0;
  public productGroupingId?: number;
  public productGroupingCode?: string;
  public productGroupingName?: string;
  public saleEmployeeId?: number;
  public organizationName?: string;
  public organizationId?: number;
  public indirectQuantityPlanned?: number;
  public indirectQuantity?: number;
  public indirectQuantityRatio?: number;
  public indirectRevenuePlanned?: number;
  public indirectRevenue?: number;
  public indirectRevenueRatio?: number;
  public indirectAmountPlanned?: number;
  public indirectAmount?: number;
  public indirectAmountRatio?: number;
  public indirectStorePlanned?: number;
  public indirectStore?: number;
  public indirectStoreRatio?: number;
  public directQuantityPlanned?: number;
  public directQuantity?: number;
  public directQuantityRatio?: number;
  public directRevenuePlanned?: number;
  public directRevenue?: number;
  public directRevenueRatio?: number;
  public directAmountPlanned?: number;
  public directAmount?: number;
  public directAmountRatio?: number;
  public directStorePlanned?: number;
  public directStore?: number;
  public directStoreRatio?: number;
}
