import { DateFilter } from './../core/filters/DateFilter';
import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ProductFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public search?: string;
  public code?: StringFilter = new StringFilter();
  public supplierCode?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public description?: StringFilter = new StringFilter();
  public scanCode?: StringFilter = new StringFilter();
  public productTypeId?: IdFilter = new IdFilter();
  public supplierId?: IdFilter = new IdFilter();
  public brandId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public unitOfMeasureGroupingId?: IdFilter = new IdFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public retailPrice?: NumberFilter = new NumberFilter();
  public taxTypeId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public otherName?: StringFilter = new StringFilter();
  public productGroupingId?: IdFilter = new IdFilter();
  public technicalName?: StringFilter = new StringFilter();
  public usedVariationId?: IdFilter = new IdFilter();
  public unitOfMeasureName?: StringFilter = new StringFilter();
  public categoryId?: IdFilter = new IdFilter();
  public updatedAt?: DateFilter = new DateFilter();
}
