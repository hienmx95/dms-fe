import {ModelFilter} from 'core/models';
import {IdFilter} from 'core/filters';

export class ProductProductGroupingMappingsFilter extends ModelFilter {
  public productId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
}
