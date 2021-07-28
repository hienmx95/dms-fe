import { DateFilter, IdFilter, StringFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import { StoreImageMapping } from 'models/StoreImageMapping';
import { Moment } from 'moment';
import { Store } from 'models/Store';

export class StoreImagesMonitor extends Model {
  public id?: number;
  public organizationName?: string;
  public saleEmployees?: SaleEmployee[];
}

export class StoreImagesMonitorFilter extends ModelFilter {
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: StringFilter = new StringFilter();
  public storeId?: StringFilter = new StringFilter();
  public hasImage?: IdFilter = new IdFilter();
  public hasOrder?: IdFilter = new IdFilter();
  public checkIn?: DateFilter = new DateFilter();
}

export class SaleEmployee extends Model {
  public saleEmployeeId?: number;
  public username?: string;
  public displayName?: string;
  public organizationName?: string;
  public storeCheckings?: StoreChecking[];
}

export class StoreChecking extends Model {
  public id?: number;
  public date?: Moment;
  public storeId?: number;
  public storeName?: string;
  public store?: Store;
  public imageCounter?: number;
}

export class StoreImagesDetail extends Model {
  public id?: number;
  public storeId?: number;
  public saleEmployeeId?: number;
  public latitude?: number;
  public longtitude?: number;
  public checkInAt?: Moment;
  public checkOutAt?: Moment;
  public store?: Store;
  public storeImageMappings: StoreImageMapping[];
}