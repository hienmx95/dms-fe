import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';
export class WorkflowDirectionConditionFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public workflowDirectionId?: IdFilter = new IdFilter();
  public workflowParameterId?: IdFilter = new IdFilter();
  public workflowOperatorId?: IdFilter = new IdFilter();
}
