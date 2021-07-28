import { Model } from 'core/models';
import { SurveyOptionType } from './SurveyOptionType';
import { SurveyQuestion } from './SurveyQuestion';

export class SurveyOption extends Model
{
    public id?: number;

    public surveyQuestionId?: number;

    public surveyOptionTypeId?: number;

    public content?: string;

    public surveyOptionType?: SurveyOptionType;

    public surveyQuestion?: SurveyQuestion;

    public listIndex?: number;
}
