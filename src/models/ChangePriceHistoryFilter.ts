import { DateFilter, IdFilter} from 'core/filters';
import { ModelFilter } from 'core/models';

export class ChangePriceHistoryFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public productId?: IdFilter = new IdFilter();
  public updateTime?: DateFilter = new DateFilter();
  public time?: DateFilter = new DateFilter();
}