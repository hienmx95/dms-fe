import { Model } from 'core/models';

export class StoreCheckerDetail extends Model {
  public storeCode?: string;
  public storeName?: string;
  public storeId?: number;
  public imageCounter?: number;
  public infoes?: StoreCheckerMonitorDetailInfo[];
}
// for detail popup data
export class StoreCheckerMonitorDetailInfo {
  public indirectSalesOrderCode?: string;
  public sales: number;
  public imagePath?: string;
  public imageCounter?: number;
  public storeProblemCode?: string;
  public storeProblemId?: number;
  public problemId?: number;
  public problemCode?: string;
  public competitorProblemCode?: string;
  public competitorProblemId?: number;
}

export class StoreCheckerDetailTableData extends Model {
  public storeCode?: string;
  public storeName?: string;
  public storeId?: number;
  public indirectSalesOrderCode?: string;
  public sales: number;
  public imagePath?: string;
  public imageCounter?: number;
  public storeProblemCode?: string;
  public problemId?: number;
  public problemCode?: string;
  public competitorProblemId?: number;
  public competitorProblemCode?: string;
  public storeProblemId?: number;
  public rowSpan?: number;
  public colSpan?: number;
  public unchecking?: number;
}
