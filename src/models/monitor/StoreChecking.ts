import { Moment } from 'moment';
import { Model } from 'core/models';
import { AppUser } from 'models/AppUser';
import { Store } from 'models/Store';
import { StoreImageMapping } from 'models/StoreImageMapping';

export class StoreChecking extends Model {
  public id?: number;
  public latitude?: number;
  public longitude?: number;
  public saleEmployeeId?: number;
  public storeId?: number;
  public storeStatusId?: number;
  public date?: Moment;
  public planCounter?: number;
  public internalCounter?: number;
  public externalCounter?: number;
  public imageCounter?: number;
  public salesOrderCounter?: number;
  public revenueCounter?: number;
  public checkInAt?: Moment;
  public checkOutAt?: Moment;
  public saleEmployee?: AppUser;
  public isScouting?: boolean;
  public store?: Store;
  public storeCheckingImageMappings: StoreImageMapping[];
}
