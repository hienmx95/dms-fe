import { Model } from 'core/models';
import { Product } from './Product';
import { ProductGrouping } from './ProductGrouping';

export class ProductProductGroupingMapping extends Model {
  public productId?: number;
  public productGroupingId?: number;
  public product?: Product;
  public productGrouping?: ProductGrouping;
}
