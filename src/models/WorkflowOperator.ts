import { Model } from 'core/models/Model';

export class WorkflowOperator extends Model {
  public id: number;
  public code: string;
  public name: string;
  public workflowParameterTypeId: number;
}
