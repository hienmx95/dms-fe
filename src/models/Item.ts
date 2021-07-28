import { Model } from 'core/models';
import { Moment } from 'moment';
import { Product } from './Product';
import { Status } from './Status';
import { ItemImageMapping } from './ItemImageMapping';
import { Image } from './Image';

export class Item extends Model {
  public id?: number;
  public productId?: number;
  public code?: string;
  public name?: string;
  public scanCode?: string;
  public salePrice?: number;
  public retailPrice?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public product?: Product;
  public canDelete?: boolean = true;
  public variationId?: number;
  public statusId?: number = 1;
  public status?: Status;
  public itemImageMappings?: ItemImageMapping[];
  public images?: Image[];
}
