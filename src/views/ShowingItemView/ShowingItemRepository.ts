import { AxiosResponse } from 'axios';
import { API_SHOWING_ITEM_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { Category, CategoryFilter } from 'models/Category';
import { Image } from 'models/Image';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class ShowingItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SHOWING_ITEM_ROUTE));
  }

  public count = (filter?: ShowingItemFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: ShowingItemFilter): Promise<ShowingItem[]> => {
    return this.http
      .post<ShowingItem[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<ShowingItem[]>) => {
        return response.data?.map((showingItem: PureModelData<ShowingItem>) =>
          ShowingItem.clone<ShowingItem>(showingItem),
        );
      });
  };

  public get = (id: number | string): Promise<ShowingItem> => {
    return this.http
      .post<ShowingItem>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ShowingItem>) =>
        ShowingItem.clone<ShowingItem>(response.data),
      );
  };

  public create = (showingItem: ShowingItem): Promise<ShowingItem> => {
    return this.http
      .post<ShowingItem>(kebabCase(nameof(this.create)), showingItem)
      .then((response: AxiosResponse<PureModelData<ShowingItem>>) =>
        ShowingItem.clone<ShowingItem>(response.data),
      );
  };

  public update = (showingItem: ShowingItem): Promise<ShowingItem> => {
    return this.http
      .post<ShowingItem>(kebabCase(nameof(this.update)), showingItem)
      .then((response: AxiosResponse<ShowingItem>) =>
        ShowingItem.clone<ShowingItem>(response.data),
      );
  };

  public delete = (showingItem: ShowingItem): Promise<ShowingItem> => {
    return this.http
      .post<ShowingItem>(kebabCase(nameof(this.delete)), showingItem)
      .then((response: AxiosResponse<ShowingItem>) =>
        ShowingItem.clone<ShowingItem>(response.data),
      );
  };

  public save = (showingItem: ShowingItem): Promise<ShowingItem> => {
    return showingItem.id ? this.update(showingItem) : this.create(showingItem);
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

  public singleListUsedVariation = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListUsedVariation)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListUsedVariation = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListUsedVariation)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public singleListUnitOfMeasure = (
    unitOfMeasureFilter: UnitOfMeasureFilter,
  ): Promise<UnitOfMeasure[]> => {
    return this.http
      .post<UnitOfMeasure[]>(
        kebabCase(nameof(this.singleListUnitOfMeasure)),
        unitOfMeasureFilter,
      )
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map(
          (unitOfMeasure: PureModelData<UnitOfMeasure>) =>
            UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure),
        );
      });
  };

  public filterListUnitOfMeasure = (
    unitOfMeasureFilter: UnitOfMeasureFilter,
  ): Promise<UnitOfMeasure[]> => {
    return this.http
      .post<UnitOfMeasureGrouping[]>(
        kebabCase(nameof(this.filterListUnitOfMeasure)),
        unitOfMeasureFilter,
      )
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map(
          (unitOfMeasure: PureModelData<UnitOfMeasure>) =>
            UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public filterListShowingCategory = (
    filter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(
        kebabCase(nameof(this.filterListShowingCategory)),
        filter,
      )
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Category>) =>
            Category.clone<Category>(item),
          ),
        );
      });
  };

  public singleListShowingCategory = (
    filter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(
        kebabCase(nameof(this.singleListShowingCategory)),
        filter,
      )
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Category>) =>
            Category.clone<Category>(item),
          ),
        );
      });
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (model?: ShowingItem): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.export)), model, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    model?: ShowingItem,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.exportTemplate)), model, {
      responseType: 'arraybuffer',
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

export const showingItemRepository: ShowingItem = new ShowingItemRepository();
