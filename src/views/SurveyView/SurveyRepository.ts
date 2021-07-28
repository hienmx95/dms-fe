import { AxiosResponse } from 'axios';
import { API_SURVEY_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Survey } from 'models/Survey';
import { SurveyFilter } from 'models/SurveyFilter';
import { SurveyOptionType } from 'models/SurveyOptionType';
import { SurveyOptionTypeFilter } from 'models/SurveyOptionTypeFilter';
import { SurveyQuestion } from 'models/SurveyQuestion';
import { SurveyQuestionFilter } from 'models/SurveyQuestionFilter';
import { SurveyQuestionType } from 'models/SurveyQuestionType';
import { SurveyQuestionTypeFilter } from 'models/SurveyQuestionTypeFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { Image } from 'models/Image';

export class SurveyRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SURVEY_ROUTE));
  }

  public count = (surveyFilter?: SurveyFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), surveyFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (surveyFilter?: SurveyFilter): Promise<Survey[]> => {
    return this.http
      .post<Survey[]>(kebabCase(nameof(this.list)), surveyFilter)
      .then((response: AxiosResponse<Survey[]>) => {
        return response.data?.map((survey: PureModelData<Survey>) =>
          Survey.clone<Survey>(survey),
        );
      });
  };

  public get = (id: number | string): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };

  public create = (survey: Survey): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.create)), survey)
      .then((response: AxiosResponse<PureModelData<Survey>>) =>
        Survey.clone<Survey>(response.data),
      );
  };

  public update = (survey: Survey): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.update)), survey)
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };

  public delete = (survey: Survey): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.delete)), survey)
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };

  public save = (survey: Survey): Promise<Survey> => {
    return survey.id ? this.update(survey) : this.create(survey);
  };

  public singleListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public singleListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public singleListSurveyQuestion = (
    surveyQuestionFilter: SurveyQuestionFilter,
  ): Promise<SurveyQuestion[]> => {
    return this.http
      .post<SurveyQuestion[]>(
        kebabCase(nameof(this.singleListSurveyQuestion)),
        surveyQuestionFilter,
      )
      .then((response: AxiosResponse<SurveyQuestion[]>) => {
        return response.data.map(
          (surveyQuestion: PureModelData<SurveyQuestion>) =>
            SurveyQuestion.clone<SurveyQuestion>(surveyQuestion),
        );
      });
  };

  public singleListSurveyOptionType = (
    surveyOptionTypeFilter: SurveyOptionTypeFilter,
  ): Promise<SurveyOptionType[]> => {
    return this.http
      .post<SurveyOptionType[]>(
        kebabCase(nameof(this.singleListSurveyOptionType)),
        surveyOptionTypeFilter,
      )
      .then((response: AxiosResponse<SurveyOptionType[]>) => {
        return response.data.map(
          (surveyOptionType: PureModelData<SurveyOptionType>) =>
            SurveyOptionType.clone<SurveyOptionType>(surveyOptionType),
        );
      });
  };
  public filterListOrganization = (
    filter?: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Organization>) =>
            Organization.clone<Organization>(item),
          ),
        );
      });
  };

  public singleListSurveyQuestionType = (): Promise<SurveyQuestionType[]> => {
    return this.http
      .post<SurveyQuestionType[]>(
        kebabCase(nameof(this.singleListSurveyQuestionType)),
        new SurveyQuestionTypeFilter(),
      )
      .then((response: AxiosResponse<SurveyQuestionType[]>) => {
        return response.data.map(
          (surveyQuestionType: PureModelData<SurveyQuestionType>) =>
            SurveyQuestionType.clone<SurveyQuestionType>(surveyQuestionType),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    surveyFilter?: SurveyFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', surveyFilter, {
      responseType: 'arraybuffer',
    });
  };

  public answerStatistics = (id: number | string): Promise<Survey> => {
    return this.http
      .post<Survey>(kebabCase(nameof(this.answerStatistics)), { id })
      .then((response: AxiosResponse<Survey>) =>
        Survey.clone<Survey>(response.data),
      );
  };
  public uploadImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post('/save-question-image', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
  };

  public uploadFiles = (
    listFile: File[],
    params?: { [key: string]: any },
  ): Promise<File> => {
    const formData: FormData = new FormData();
    for (let i = 0; i < listFile.length; i++) {
      formData.append('files', listFile[i] as Blob);
    }

    return this.http
      .post('/save-question-multi-file', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<File>) => response.data);
  };
}

export const surveyRepository: Survey = new SurveyRepository();
