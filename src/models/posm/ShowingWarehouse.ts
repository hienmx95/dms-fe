import { District } from 'models/District';
import { Organization } from 'models/Organization';
import { Province } from 'models/Province';
import { Status } from 'models/Status';
import { Ward } from 'models/Ward';
import { Model } from 'core/models';
import { ShowingInventory } from './ShowingInventory';

export class ShowingWarehouse extends Model {
  public id?: number;

  public code?: string;

  public name?: string;

  public address?: string;

  public organizationId?: number;

  public provinceId?: number;

  public districtId?: number;

  public wardId?: number;

  public statusId?: number = 1;

  public rowId?: string;

  public district?: District;

  public organization?: Organization;

  public province?: Province;

  public status?: Status;

  public ward?: Ward;

  public showingInventories?: ShowingInventory[];
}
