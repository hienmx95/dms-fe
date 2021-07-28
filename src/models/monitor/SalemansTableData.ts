import { Model } from 'core/models';
import { StoreChecking } from 'models/monitor/SalemansMonitor';
export class SalemansTableData extends Model {
  public id?: number;
  public saleEmployeeId?: number;
  public displayName?: string;
  public username?: string;
  public organizationName?: string;
  public planCounter?: number;
  public internalCounter?: number;
  public externalCounter?: number;
  public imageCounter?: number;
  public salesOrderCounter?: number;
  public revenue?: number;
  public rowSpan?: number = 0;
  public storeCheckings?: StoreChecking;
  public title?: string;
  public indexInTable?: number;
  public unchecking?: number;
}
