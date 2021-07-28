import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ShowingOrderWithdrawContentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public showingOrderId?: IdFilter = new IdFilter();
  public showingItemId?: IdFilter = new IdFilter();
  public unitOfMeasureId?: IdFilter = new IdFilter();
  public salePrice?: NumberFilter = new NumberFilter();
  public quantity?: NumberFilter = new NumberFilter();
  public amount?: NumberFilter = new NumberFilter();
}
