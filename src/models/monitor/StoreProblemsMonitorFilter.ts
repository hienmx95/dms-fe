import { ModelFilter } from 'core/models';
import { DateFilter, IdFilter, StringFilter } from 'core/filters';
export class StoreProblemsMonitorFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
  public storeCheckingId: IdFilter = new IdFilter();
  public problemStatusId: IdFilter = new IdFilter();
  public problemTypeId?: IdFilter = new IdFilter();
  public storeId: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public noteAt?: DateFilter = new DateFilter();
  public completedAt?: DateFilter = new DateFilter();
  public content?: StringFilter = new StringFilter();
}
