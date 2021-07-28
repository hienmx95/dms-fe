import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class TopSaleEmployeeFilter extends ModelFilter {
  public time?: StringFilter = new StringFilter();
  organizationId?: IdFilter = new IdFilter();
  appUserId?: IdFilter = new IdFilter();
}
