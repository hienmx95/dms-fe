import { IdFilter, NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ERouteContentFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public eRouteId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public orderNumber?: NumberFilter = new NumberFilter();
}
