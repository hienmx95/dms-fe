import {IdFilter, StringFilter, NumberFilter, DateFilter} from 'core/filters';
import {ModelFilter} from 'core/models';

export class StoreImageMappingFilter extends ModelFilter {
  public storeId?: IdFilter = new IdFilter();
  public imageId?: IdFilter = new IdFilter();
}
