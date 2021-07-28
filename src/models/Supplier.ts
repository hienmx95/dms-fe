import { Model } from 'core/models';
import { Moment } from 'moment';
import { Status } from './Status';
import { District } from './District';
import { AppUser } from './AppUser';
import { Province } from './Province';
import { Ward } from './Ward';

export class Supplier extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
  public taxCode?: string;
  public phone?: string;
  public email?: string;
  public address?: string;
  public provinceId?: number;
  public districtId?: number;
  public wardId?: number;
  public ownerName?: string;
  public personInChargeId?: number;
  public statusId?: number = 1;
  public description?: string;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public district?: District;
  public personInCharge?: AppUser;
  public province?: Province;
  public status?: Status;
  public ward?: Ward;
  public updatedTime?: Moment;
}
