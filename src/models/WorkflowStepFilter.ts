import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class WorkflowStepFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public workflowDefinitionId?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();
  public code?: StringFilter = new StringFilter();
  public roleId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
}
