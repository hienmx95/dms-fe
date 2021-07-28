import { ProductGrouping } from './ProductGrouping';
import { Model } from 'core/models';

export class BrandInStoreProductGroupingMapping extends Model {
  public brandInStoreId?: number;
  public productGroupingId?: number;
  public productGrouping?: ProductGrouping;
  public productGroupings?: string;
}
