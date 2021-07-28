import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class BrandInStoreFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public brandId?: IdFilter = new IdFilter();
  public top?: NumberFilter = new NumberFilter();
  public creatorId?: IdFilter = new IdFilter();
}
