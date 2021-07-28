import { Model } from 'core/models';
import { EnumList } from 'models/EnumList';
import { StoreChecking } from 'models/monitor/StoreChecking';
import { Moment } from 'moment';

export class StoreCompetitorsMonitor extends Model {
  public id?: number;
  public organizationId?: number;
  public saleEmployeeId?: number;
  public salesOrderId?: number;
  public checkingId?: number;
  public imageId?: number;
  public displayName?: string;
  public username?: string;
  public organizationName?: string;
  public checking?: EnumList;
  public image?: EnumList;
  public date?: Moment;
  public storeCheckings?: StoreChecking[];
}
