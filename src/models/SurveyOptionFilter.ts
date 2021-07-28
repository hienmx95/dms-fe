import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class SurveyOptionFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public surveyQuestionId?: IdFilter = new IdFilter();
  public surveyOptionTypeId?: IdFilter = new IdFilter();
  public content?: StringFilter = new StringFilter();
}
