import { Model } from 'core/models';
import { Moment } from 'moment';
import { WorkflowType } from './WorkflowType';
import { WorkflowDirection } from './WorkflowDirection';
import { WorkflowParameter } from './WorkflowParameter';
import { WorkflowStep } from './WorkflowStep';

export class WorkflowDefinition extends Model {
  public id?: number;

  public name?: string;

  public workflowTypeId?: number;

  public startDate?: Moment;

  public endDate?: Moment;

  public statusId?: number = 0;

  public workflowType?: WorkflowType;

  public workflowDirections?: WorkflowDirection[];

  public workflowParameters?: WorkflowParameter[];

  public workflowSteps?: WorkflowStep[];
  public createAt?: Moment;
  public updateAt?: Moment;
}
