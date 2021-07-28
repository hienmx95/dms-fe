import { ModelFilter } from 'core/models';
import { DateFilter, IdFilter, StringFilter } from 'core/filters';
export class StoreCheckerMonitorFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public salesOrder: IdFilter = new IdFilter();
  public checking: IdFilter = new IdFilter();
  public image?: IdFilter = new IdFilter();
  public date?: DateFilter = new DateFilter();
  public displayName?: StringFilter = new StringFilter();
  public username?: StringFilter = new StringFilter();
  public organizationName?: StringFilter = new StringFilter();
  public checkIn?: DateFilter = new DateFilter();
}
