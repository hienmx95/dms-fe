import { DateFilter, IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class ERouteFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public appUserId?: IdFilter = new IdFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public requestStateId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public eRouteTypeId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
}
