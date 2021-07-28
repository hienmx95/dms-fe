import { Model } from 'core/models';
import { Moment } from 'moment';
import { Product } from './Product';

export class VariationGrouping extends Model {
  public id?: number;
  code?: string = null;
  public name?: string;
  public productId?: number;
  public createdAt?: Moment;
  public updatedAt?: Moment;
  public deletedAt?: Moment;
  public product?: Product;
}
