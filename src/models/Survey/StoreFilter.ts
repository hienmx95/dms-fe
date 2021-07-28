import { ModelFilter } from 'core/models';
import { StringFilter, IdFilter } from 'core/filters';

export class StoreFilter extends ModelFilter {
  public storeCode?: StringFilter = new StringFilter();
  public storeName?: StringFilter = new StringFilter();
  public organizationName?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
}
