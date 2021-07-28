import {IdFilter} from 'core/filters';
import {ModelFilter} from 'core/models';

export class ItemImageMappingFilter extends ModelFilter {
  public itemId?: IdFilter = new IdFilter();
  public imageId?: IdFilter = new IdFilter();
}
