import { AxiosResponse } from 'axios';
import kebabCase from 'lodash/kebabCase';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_MOBILE_BANNER_ROUTE } from 'config/api-consts';
import { Survey } from 'models/Survey';
import nameof from 'ts-nameof.macro';
export class SurveyRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_MOBILE_BANNER_ROUTE));
  }

  public getSurveyForm = (id: number | string): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.getSurveyForm)), { id })
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };

  public saveSurveyForm = (survey: Survey): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.saveSurveyForm)), survey)
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };
}

export const surveyRepository: Survey = new SurveyRepository();
