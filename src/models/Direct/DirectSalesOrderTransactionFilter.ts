import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class DirectSalesOrderTransactionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public directSalesOrderId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public itemId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public discount?: NumberFilter = new NumberFilter();
  public revenue?: NumberFilter = new NumberFilter();
  public typeId?: IdFilter = new IdFilter();
}
