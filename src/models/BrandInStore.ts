import { Model } from 'core/models';
import { Moment } from 'moment';
import { Brand } from './Brand';
import { AppUser } from './AppUser';
import { BrandInStoreProductGroupingMapping } from './BrandInStoreProductGroupingMapping';

export class BrandInStore extends Model {
  public id?: number;
  public storeId?: number;
  public brandId?: number;
  public top?: number;
  public creatorId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public brand?: Brand;
  public creator?: AppUser;
  public brandInStoreProductGroupingMappings?: BrandInStoreProductGroupingMapping[];
}
