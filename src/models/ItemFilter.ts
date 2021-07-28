import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ItemFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public productId?: IdFilter = new IdFilter();
  public categoryId?: IdFilter = new IdFilter();
  public productTypeId?: IdFilter = new IdFilter();
  public productGroupingId?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public scanCode?: StringFilter = new StringFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public retailPrice?: NumberFilter = new NumberFilter();
  public buyerStoreId?: IdFilter = new IdFilter();
  public supplierId?: IdFilter = new IdFilter();
  public brandId?: IdFilter = new IdFilter();
  public codeLower?: StringFilter = new StringFilter();
  public nameLower?: StringFilter = new StringFilter();
  public storeId?: IdFilter = new IdFilter();
  public otherName?: StringFilter = new StringFilter();
  public salesEmployeeId?: IdFilter = new IdFilter();
  public search?: string;
  public isNew?: boolean;
}
