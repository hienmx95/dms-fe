import { WorkflowDirectionCondition } from './WorkflowDirectionCondition';
import { Model } from 'core/models';
import { WorkflowStep } from './WorkflowStep';
import { Status } from './Status';
import { Moment } from 'moment';
import { WorkflowDefinition } from './WorkflowDefinition';
export class WorkflowDirection extends Model {
  public id?: number;

  public workflowDefinitionId?: number;

  public workflowDefinition?: WorkflowDefinition;

  public fromStepId?: number;

  public toStepId?: number;

  public subjectMailForCreator?: string;

  public subjectMailForNextStep?: string;

  public bodyMailForCreator?: string;

  public bodyMailForNextStep?: string;

  public fromStep?: WorkflowStep;

  public toStep?: WorkflowStep;

  public status?: Status;

  public statusId?: number = 1;

  public updatedAt?: Moment;

  public workflowDirectionConditions?: WorkflowDirectionCondition[];

  public subjectMailForCurrentStep?: string;

  public bodyMailForCurrentStep?: string;
}
