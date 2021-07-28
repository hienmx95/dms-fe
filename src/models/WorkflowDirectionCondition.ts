import { WorkflowParameter } from './WorkflowParameter';
import { WorkflowOperator } from './WorkflowOperator';
import { Model } from 'core/models/Model';
export class WorkflowDirectionCondition extends Model {
  public id?: number;
  public workflowDirectionId?: number;
  public workflowParameterId?: number;
  public workflowOperatorId?: number;
  public value?: string;
  public workflowOperator?: WorkflowOperator;
  public workflowParameter?: WorkflowParameter;
}
