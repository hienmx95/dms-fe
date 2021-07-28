import { Moment } from 'moment';
import { AppUser } from 'models/AppUser';
import { Organization } from 'models/Organization';
import { Status } from 'models/Status';
import { Model } from 'core/models';
import { ShowingWarehouse } from './ShowingWarehouse';
import { ShowingOrderWithdrawContent } from './ShowingOrderWithdrawContent';
import { Store } from 'models/Store';

export class ShowingOrderWithdraw extends Model {
  public id?: number;

  public code?: string;

  public appUserId?: number;

  public organizationId?: number;

  public date?: Moment;

  public showingWarehouseId?: number;

  public statusId?: number = 1;

  public total?: number;

  public rowId?: string;

  public appUser?: AppUser;

  public organization?: Organization;

  public showingWarehouse?: ShowingWarehouse;

  public status?: Status;

  public showingOrderContentWithDraws?: ShowingOrderWithdrawContent[];

  public stores?: Store[];

  public storeId?: number;

  public store?: Store;
}
