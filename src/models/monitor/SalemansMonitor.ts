import { Model } from 'core/models';

export class SalemansMonitor extends Model {
  public id?: number;
  public organizationName?: string;
  public saleEmployees?: SaleEmployee[];
}

export class SaleEmployee extends Model {
  public saleEmployeeId?: number;
  public username?: string;
  public displayName?: string;
  public organizationName?: string;
  public planCounter: number;
  public internalCounter: number;
  public externalCounter: number;
  public salesOrderCounter: number;
  public imageCounter: number;
  public revenue: number;
  public storeCheckings?: StoreChecking[];
}

export class StoreChecking extends Model {
  public id?: number;
  public storeCode?: string;
  public storeName?: string;
  public storeId?: number;
  public longitude?: number;
  public latitude?: number;
  public checkIn?: number;
  public checkOut?: number;
  public indirectSalesOrder?: SaleOrder[];
  public storeProblems?: StoreProblems[];
  public competitorProblems?: StoreCompetitors[];
  public image?: string;
}

export class StoreProblems extends Model {
  public id?: number;
  public code?: string;
}

export class StoreCompetitors extends Model {
  public id?: number;
  public code?: string;
}

export class SaleOrder extends Model {
  public id?: number;
  public code?: string;
}
