import { AxiosResponse } from 'axios';
import { API_CATEGORY_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Category, CategoryFilter } from 'models/Category';
import { Image } from 'models/Image';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
export class CategoryRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_CATEGORY_ROUTE));
  }

  public count = (filter?: CategoryFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: CategoryFilter): Promise<Category[]> => {
    return this.http
      .post<Category[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data?.map((model: PureModelData<Category>) =>
            Category.clone<Category>(model),
          ),
        );
      });
  };

  public get = (id: number | string): Promise<Category> => {
    return this.http
      .post<Category>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Category>) =>
        Category.clone<Category>(response.data),
      );
  };

  public save = (item: Category): Promise<Category> => {
    return item.id ? this.update(item) : this.create(item);
  };

  public update = (item: Category): Promise<Category> => {
    return this.http
      .post<Category>(kebabCase(nameof(this.update)), item)
      .then((response: AxiosResponse<Category>) =>
        Category.clone<Category>(response.data),
      );
  };

  public create = (item: Category): Promise<Category> => {
    return this.http
      .post<Category>(kebabCase(nameof(this.create)), item)
      .then((response: AxiosResponse<PureModelData<Category>>) =>
        Category.clone<Category>(response.data),
      );
  };

  public delete = (item: Category): Promise<Category> => {
    return this.http
      .post<Category>(kebabCase(nameof(this.delete)), item)
      .then((response: AxiosResponse<Category>) =>
        Category.clone<Category>(response.data),
      );
  };

  public export = (filter?: CategoryFilter): Promise<AxiosResponse<any>> => {
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

  public singleListCategory = (filter: CategoryFilter): Promise<Category[]> => {
    return this.http
      .post<Category[]>(kebabCase(nameof(this.singleListCategory)), filter)
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((model: PureModelData<Category>) =>
            Category.clone<Category>(model),
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

export const categoryRepository = new CategoryRepository();
