import { IdFilter, NumberFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ERouteChangeRequestContentFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public eRouteChangeRequestId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public orderNumber?: NumberFilter = new NumberFilter();
}
