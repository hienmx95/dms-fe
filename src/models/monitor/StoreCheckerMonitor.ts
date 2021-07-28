import { Model } from 'core/models';
import { StoreChecking } from 'models/monitor/StoreChecking';

export class StoreCheckerMonitor extends Model {
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
  public checkinCounter: number;
  public imageCounter: number;
  public revenue: number;
  public storeCheckings?: StoreChecking[];
}
