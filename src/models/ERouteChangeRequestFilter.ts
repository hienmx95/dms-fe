import { IdFilter, StringFilter, DateFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ERouteChangeRequestFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public eRouteId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public requestStateId?: IdFilter = new IdFilter();
  public code : StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public saleEmployeeId?: IdFilter = new IdFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public eRouteTypeId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
}
