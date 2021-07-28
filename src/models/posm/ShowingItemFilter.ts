import { GuidFilter, IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ShowingItemFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public showingCategoryId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public desception?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
  public rowId?: GuidFilter = new GuidFilter();
  public showingWarehouseId?: IdFilter = new IdFilter();
  public search?: string;
}
