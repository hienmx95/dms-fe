import { Model } from 'core/models';
import { Role } from './Role';
import { Status } from './Status';
import { WorkflowDefinition } from './WorkflowDefinition';

export class WorkflowStep extends Model {
  public id?: number;
  public workflowDefinitionId?: number;
  public name?: string;

  public roleId?: number;

  public role?: Role;
  public workflowDefinition?: WorkflowDefinition;
  public subjectMailForReject?: string;
  public bodyMailForReject?: string;

  public status?: Status;
  public statusId?: number = 1;
}
