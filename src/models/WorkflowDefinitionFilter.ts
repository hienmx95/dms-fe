import { StringFilter } from 'core/filters';
import { IdFilter } from 'core/filters';
import { DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class WorkflowDefinitionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public code?: StringFilter = new StringFilter();
  public workflowTypeId?: IdFilter = new IdFilter();
  public startDate?: DateFilter = new DateFilter();
  public endDate?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
}
