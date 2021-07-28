import { ModelFilter } from 'core/models';
import { IdFilter } from 'core/filters';

export class ShowingItemImageMappingFilter extends ModelFilter {
  public productId?: IdFilter = new IdFilter();
  public showingItemId?: IdFilter = new IdFilter();
}
