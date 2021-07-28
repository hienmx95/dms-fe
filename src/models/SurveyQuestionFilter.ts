import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class SurveyQuestionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public surveyId?: IdFilter = new IdFilter();
  public content?: StringFilter = new StringFilter();
  public surveyQuestionTypeId?: IdFilter = new IdFilter();
}
