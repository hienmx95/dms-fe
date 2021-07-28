import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DirectSalesOrderPromotionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public directSalesOrderId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public primaryUnitOfMeasureId?: IdFilter = new IdFilter();
  public requestedQuantity?: NumberFilter = new NumberFilter();
  public note?: StringFilter = new StringFilter();
  public factor?: NumberFilter = new NumberFilter();
}
