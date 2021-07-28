import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class WorkflowDirectionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public workflowDefinitionId?: IdFilter = new IdFilter();
  public fromStepId?: IdFilter = new IdFilter();
  public toStepId?: IdFilter = new IdFilter();

  public statusId?: IdFilter = new IdFilter();
  public subjectMailForCreator?: StringFilter = new StringFilter();
  public subjectMailForNextStep?: StringFilter = new StringFilter();
  public bodyMailForCreator?: StringFilter = new StringFilter();
  public bodyMailForNextStep?: StringFilter = new StringFilter();
}
