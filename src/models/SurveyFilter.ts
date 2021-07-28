import { StringFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { DateFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class SurveyFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public title?: StringFilter = new StringFilter();
  public description?: StringFilter = new StringFilter();
  public startAt?: DateFilter = new DateFilter();
  public endAt?: DateFilter = new DateFilter();
  public statusId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();

  public creatorId?: IdFilter = new IdFilter();
}
