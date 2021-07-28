import { IdFilter, NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class IndirectSalesOrderContentFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public indirectSalesOrderId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public primaryUnitOfMeasureId?: IdFilter = new IdFilter();
  public requestedQuantity?: NumberFilter = new NumberFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public discountPercentage?: NumberFilter = new NumberFilter();
  public discountAmount?: NumberFilter = new NumberFilter();
  public generalDiscountPercentage?: NumberFilter = new NumberFilter();
  public generalDiscountAmount?: NumberFilter = new NumberFilter();
  public amount?: NumberFilter = new NumberFilter();
  public taxPercentage?: NumberFilter = new NumberFilter();
  public taxAmount?: NumberFilter = new NumberFilter();
}
