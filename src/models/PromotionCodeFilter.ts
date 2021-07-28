import { StringFilter } from 'core/filters';
import { IdFilter } from 'core/filters';
import { NumberFilter } from 'core/filters';
import { DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class PromotionCodeFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public promotionDiscountTypeId?: IdFilter = new IdFilter();
  public value?: NumberFilter = new NumberFilter();
  public maxValue?: NumberFilter = new NumberFilter();
  public promotionTypeId?: IdFilter = new IdFilter();
  public promotionProductAppliedTypeId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
}
