import { Model } from 'core/models';

export class SalemansDetail extends Model {
  public storeCode?: string;
  public storeName?: string;
  public imageCounter?: number;
  public infoes?: SalemansDetailInfo[];
}

export class SalemansDetailInfo {
  public indirectSalesOrderCode?: string;
  public sales: number;
  public imagePath?: string;
  public problemCode?: string;
  public problemId?: number;
  public competitorProblemCode?: string;
  public competitorProblemId?: number;
}

export class SalemansDetailTableData extends Model {
  public storeCode?: string;
  public storeName?: string;
  public storeId?: number;
  public indirectSalesOrderCode?: string;
  public sales: number;
  public imagePath?: string;
  public imageCounter?: number;
  public problemCode?: string;
  public competitorProblemCode?: string;
  public problemId?: number;
  public competitorProblemId?: number;
  public rowSpan?: number;
  public colSpan?: number;
}
