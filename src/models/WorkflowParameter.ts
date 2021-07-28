import { Model } from 'core/models';
import { WorkflowDefinition } from './WorkflowDefinition';

export class WorkflowParameter extends Model {
  public id?: number;

  public workflowDefinitionId?: number;

  public name?: string;

  public workflowDefinition?: WorkflowDefinition;
  public workflowParameterTypeId?: number;
}
