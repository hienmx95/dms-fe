import {IdFilter, StringFilter, NumberFilter, DateFilter} from 'core/filters';
import {ModelFilter} from 'core/models';

export class ProductImageMappingFilter extends ModelFilter {
  public productId?: IdFilter = new IdFilter();
  public imageId?: IdFilter = new IdFilter();
}
