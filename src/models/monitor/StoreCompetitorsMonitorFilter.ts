import { ModelFilter } from 'core/models';
import { DateFilter, IdFilter, StringFilter } from 'core/filters';

export class StoreCompetitorsMonitorFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public saleEmployeeId?: IdFilter = new IdFilter();
  public salesOrderId: IdFilter = new IdFilter();
  public checkingId: IdFilter = new IdFilter();
  public imageId?: IdFilter = new IdFilter();
  public date?: DateFilter = new DateFilter();
  public displayName?: StringFilter = new StringFilter();
  public username?: StringFilter = new StringFilter();
  public organizationName?: StringFilter = new StringFilter();
}
