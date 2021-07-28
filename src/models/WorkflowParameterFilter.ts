import { StringFilter } from 'core/filters';
import { IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class WorkflowParameterFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public workflowDefinitionId?: IdFilter = new IdFilter();
  public name?: StringFilter = new StringFilter();

  public workflowParameterTypeId?: IdFilter = new IdFilter();

  public workflowTypeId?: IdFilter = new IdFilter();
}
