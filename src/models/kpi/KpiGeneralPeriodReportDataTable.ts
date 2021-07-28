import { Model } from 'core/models';

export class KpiGeneralPeriodReportDataTable extends Model {
  public title?: string;
  public username?: string;
  public displayName?: string;
  saleEmployeeId: number;
  organizationName: string;
  totalIndirectSalesAmountPlanned: number;
  totalIndirectSalesAmount: number;
  totalIndirectSalesAmountRatio: number;
  revenueC2TDPlanned: number;
  revenueC2TD: number;
  revenueC2TDRatio: number;
  revenueC2SLPlanned: number;
  revenueC2SL: number;
  revenueC2SLRatio: number;
  revenueC2Planned: number;
  revenueC2: number;
  revenueC2Ratio: number;
  newStoreC2CreatedPlanned: number;
  newStoreC2Created: number;
  newStoreC2CreatedRatio: number;
  totalProblemPlanned: number;
  totalProblem: number;
  totalProblemRatio: number;
  totalImagePlanned: number;
  totalImage: number;
  totalImageRatio: number;
  storesVisitedPLanned: number;
  storesVisited: number;
  storesVisitedRatio: number;
  newStoreCreatedPlanned: number;
  newStoreCreated: number;
  newStoreCreatedRatio: number;
  numberOfStoreVisitsPlanned: number;
  numberOfStoreVisits: number;
  numberOfStoreVisitsRatio: number;
}
