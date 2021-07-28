import { Model } from 'core/models';
import { AppUser } from './AppUser';
import { District } from './District';
import { Organization } from './Organization';
import { Province } from './Province';
import { Status } from './Status';
import { StoreGrouping } from './StoreGrouping';
import { StoreImageMapping } from './StoreImageMapping';
import { StoreScouting } from './StoreScouting';
import { StoreStatus } from './StoreStatus';
import { StoreType } from './StoreType';
import { Ward } from './Ward';
import { BrandInStore } from './BrandInStore';

export class Store extends Model {
  public id?: number;

  public codeDraft?: string;

  public name?: string;

  public parentStoreId?: number;

  public organizationId?: number;

  public storeTypeId?: number;

  public storeGroupingId?: number;

  public telephone?: string;

  public provinceId?: number;

  public districtId?: number;

  public wardId?: number;

  public address?: string;

  public deliveryAddress?: string;

  public latitude?: number;

  public longitude?: number;

  public deliveryLatitude?: number;

  public deliveryLongitude?: number;

  public ownerName?: string;

  public ownerPhone?: string;

  public ownerEmail?: string;

  public statusId?: number = 1;

  public district?: District;

  public organization?: Organization;

  public parentStore?: Store;

  public province?: Province;

  public status?: Status;

  public storeGrouping?: StoreGrouping;

  public storeType?: StoreType;

  public ward?: Ward;
  public storeScouting?: StoreScouting;

  public storeScoutingId?: number;

  public storeImageMappings?: StoreImageMapping[];
  public taxCode?: string;

  public storeStatus?: StoreStatus;
  public storeStatusId?: number;
  public reseller?: AppUser;
  public resellerId?: number;

  public brandInStores?: BrandInStore[];
}
