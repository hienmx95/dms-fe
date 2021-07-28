import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class StoreCheckerReportFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public storeTypeId?: IdFilter = new IdFilter();
  public storeGroupingId?: IdFilter = new IdFilter();
  public storeStatusId?: IdFilter = new IdFilter();
  public checkIn?: DateFilter = new DateFilter();
  public checkingPlanStatusId?: IdFilter = new IdFilter();
}
