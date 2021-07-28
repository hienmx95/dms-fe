import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ProductProductGroupingMappingFilter extends ModelFilter {
  public productId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
}
