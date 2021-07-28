import { AxiosResponse } from 'axios';
import { API_SHOWING_CATEGORY_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Image } from 'models/Image';
import { ShowingCategory } from 'models/posm/ShowingCategory';
import { ShowingCategoryFilter } from 'models/posm/ShowingCategoryFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
export class ShowingCategoryRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SHOWING_CATEGORY_ROUTE));
  }

  public count = (filter?: ShowingCategoryFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    filter?: ShowingCategoryFilter,
  ): Promise<ShowingCategory[]> => {
    return this.http
      .post<ShowingCategory[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<ShowingCategory[]>) => {
        return buildTree(
          response.data?.map((model: PureModelData<ShowingCategory>) =>
            ShowingCategory.clone<ShowingCategory>(model),
          ),
        );
      });
  };

  public get = (id: number | string): Promise<ShowingCategory> => {
    return this.http
      .post<ShowingCategory>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ShowingCategory>) =>
        ShowingCategory.clone<ShowingCategory>(response.data),
      );
  };

  public save = (item: ShowingCategory): Promise<ShowingCategory> => {
    return item.id ? this.update(item) : this.create(item);
  };

  public update = (item: ShowingCategory): Promise<ShowingCategory> => {
    return this.http
      .post<ShowingCategory>(kebabCase(nameof(this.update)), item)
      .then((response: AxiosResponse<ShowingCategory>) =>
        ShowingCategory.clone<ShowingCategory>(response.data),
      );
  };

  public create = (item: ShowingCategory): Promise<ShowingCategory> => {
    return this.http
      .post<ShowingCategory>(kebabCase(nameof(this.create)), item)
      .then((response: AxiosResponse<PureModelData<ShowingCategory>>) =>
        ShowingCategory.clone<ShowingCategory>(response.data),
      );
  };

  public delete = (item: ShowingCategory): Promise<ShowingCategory> => {
    return this.http
      .post<ShowingCategory>(kebabCase(nameof(this.delete)), item)
      .then((response: AxiosResponse<ShowingCategory>) =>
        ShowingCategory.clone<ShowingCategory>(response.data),
      );
  };

  public export = (
    filter?: ShowingCategoryFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', filter, {
      responseType: 'arraybuffer',
    });
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

  public singleListShowingCategory = (
    filter: ShowingCategoryFilter,
  ): Promise<ShowingCategory[]> => {
    return this.http
      .post<ShowingCategory[]>(
        kebabCase(nameof(this.singleListShowingCategory)),
        filter,
      )
      .then((response: AxiosResponse<ShowingCategory[]>) => {
        return buildTree(
          response.data.map((model: PureModelData<ShowingCategory>) =>
            ShowingCategory.clone<ShowingCategory>(model),
          ),
        );
      });
  };

  public filterListShowingCategory = (
    filter: ShowingCategoryFilter,
  ): Promise<ShowingCategory[]> => {
    return this.http
      .post<ShowingCategory[]>(
        kebabCase(nameof(this.filterListShowingCategory)),
        filter,
      )
      .then((response: AxiosResponse<ShowingCategory[]>) => {
        return buildTree(
          response.data.map((model: PureModelData<ShowingCategory>) =>
            ShowingCategory.clone<ShowingCategory>(model),
          ),
        );
      });
  };

  public saveImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post(kebabCase(nameof(this.saveImage)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
  };
}

export const showingCategoryRepository = new ShowingCategoryRepository();
