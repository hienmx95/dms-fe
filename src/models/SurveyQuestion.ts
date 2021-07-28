import { Model } from 'core/models';
import { Survey } from './Survey';
import { SurveyQuestionType } from './SurveyQuestionType';
import { SurveyOption } from './SurveyOption';

export class SurveyQuestion extends Model
{
    public id?: number;

    public surveyId?: number;

    public content?: string;

    public surveyQuestionTypeId?: number;

    public isMandatory?: boolean = true;

    public survey?: Survey;

    public surveyQuestionType?: SurveyQuestionType;

    public surveyOptions?: SurveyOption[];

}
