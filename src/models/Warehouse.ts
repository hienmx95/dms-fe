import { Model } from 'core/models';
import { District } from './District';
import { Inventory } from './Inventory';
import { Organization } from './Organization';
import { Province } from './Province';
import { Status } from './Status';
import { Ward } from './Ward';

export class Warehouse extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public address?: string;

  public organizationId?: number;

  public provinceId?: number;

  public districtId?: number;

  public wardId?: number;

  public statusId?: number = 1;

  public district?: District;

  public organization?: Organization;

  public province?: Province;

  public status?: Status;

  public ward?: Ward;

  public inventories?: Inventory[];
}
