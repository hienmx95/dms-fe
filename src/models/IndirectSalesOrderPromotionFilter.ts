import { IdFilter, StringFilter, NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class IndirectSalesOrderPromotionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public indirectSalesOrderId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public primaryUnitOfMeasureId?: IdFilter = new IdFilter();
  public requestedQuantity?: NumberFilter = new NumberFilter();
  public note?: StringFilter = new StringFilter();
}
