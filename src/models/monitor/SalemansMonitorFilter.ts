import { DateFilter, IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';
export class SalemansMonitorFilter extends ModelFilter {
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public checkIn?: DateFilter = new DateFilter();
}
