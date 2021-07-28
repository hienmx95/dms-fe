import { AppUser } from 'models/AppUser';
import { Model } from 'core/models';
import { Moment } from 'moment';
import { SurveyQuestion } from './SurveyQuestion';
import { Status } from './Status';

export class Survey extends Model {
  public id?: number;

  public title?: string;

  public description?: string;

  public startAt?: Moment;

  public endAt?: Moment;

  public statusId?: number = 1;

  public surveyQuestions?: SurveyQuestion[];

  public status?: Status;

  public resultCounter?: number;

  public creator?: AppUser;
}
