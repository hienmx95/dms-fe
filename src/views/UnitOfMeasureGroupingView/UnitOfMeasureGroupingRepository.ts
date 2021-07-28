import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_UNIT_OF_MEASURE_GROUPING_ROUTE} from 'config/api-consts';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingContentFilter } from 'models/UnitOfMeasureGroupingContentFilter';

export class UnitOfMeasureGroupingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_UNIT_OF_MEASURE_GROUPING_ROUTE));
  }

  public count = (unitOfMeasureGroupingFilter?: UnitOfMeasureGroupingFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), unitOfMeasureGroupingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (unitOfMeasureGroupingFilter?: UnitOfMeasureGroupingFilter): Promise<UnitOfMeasureGrouping[]> => {
    return this.http.post<UnitOfMeasureGrouping[]>(kebabCase(nameof(this.list)), unitOfMeasureGroupingFilter)
      .then((response: AxiosResponse<UnitOfMeasureGrouping[]>) => {
        return response.data?.map((unitOfMeasureGrouping: PureModelData<UnitOfMeasureGrouping>) =>  UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(unitOfMeasureGrouping));
    });
  };

  public get = (id: number | string): Promise<UnitOfMeasureGrouping> => {
    return this.http.post<UnitOfMeasureGrouping>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<UnitOfMeasureGrouping>) => UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(response.data));
  };

  public create = (unitOfMeasureGrouping: UnitOfMeasureGrouping): Promise<UnitOfMeasureGrouping> => {
    return this.http.post<UnitOfMeasureGrouping>(kebabCase(nameof(this.create)), unitOfMeasureGrouping)
      .then((response: AxiosResponse<PureModelData<UnitOfMeasureGrouping>>) => UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(response.data));
  };

  public update = (unitOfMeasureGrouping: UnitOfMeasureGrouping): Promise<UnitOfMeasureGrouping> => {
    return this.http.post<UnitOfMeasureGrouping>(kebabCase(nameof(this.update)), unitOfMeasureGrouping)
      .then((response: AxiosResponse<UnitOfMeasureGrouping>) => UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(response.data));
  };

  public delete = (unitOfMeasureGrouping: UnitOfMeasureGrouping): Promise<UnitOfMeasureGrouping> => {
      return this.http.post<UnitOfMeasureGrouping>(kebabCase(nameof(this.delete)), unitOfMeasureGrouping)
        .then((response: AxiosResponse<UnitOfMeasureGrouping>) => UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(response.data));
  };

  public save = (unitOfMeasureGrouping: UnitOfMeasureGrouping): Promise<UnitOfMeasureGrouping> => {
      return unitOfMeasureGrouping.id ? this.update(unitOfMeasureGrouping) : this.create(unitOfMeasureGrouping);
  };

  public singleListStatus = (): Promise<Status[]> =>
  {
      return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
        .then((response: AxiosResponse<Status[]>) => {
          return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };
  public singleListUnitOfMeasure = (unitOfMeasureFilter: UnitOfMeasureFilter): Promise<UnitOfMeasure[]> => {
      return this.http.post<UnitOfMeasure[]>(kebabCase(nameof(this.singleListUnitOfMeasure)), unitOfMeasureFilter)
        .then((response: AxiosResponse<UnitOfMeasure[]>) => {
          return response.data.map((unitOfMeasure: PureModelData<UnitOfMeasure>) => UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure));
        });
  };
  public filterListUnitOfMeasure = (unitOfMeasureFilter: UnitOfMeasureFilter): Promise<UnitOfMeasure[]> => {
    return this.http.post<UnitOfMeasure[]>(kebabCase(nameof(this.filterListUnitOfMeasure)), unitOfMeasureFilter)
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map((unitOfMeasure: PureModelData<UnitOfMeasure>) => UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure));
      });
};
  public singleListUnitOfMeasureGroupingContent = (unitOfMeasureGroupingContentFilter: UnitOfMeasureGroupingContentFilter): Promise<UnitOfMeasureGroupingContent[]> => {
      return this.http.post<UnitOfMeasureGroupingContent[]>(kebabCase(nameof(this.singleListUnitOfMeasureGroupingContent)), unitOfMeasureGroupingContentFilter)
        .then((response: AxiosResponse<UnitOfMeasureGroupingContent[]>) => {
          return response.data.map((unitOfMeasureGroupingContent: PureModelData<UnitOfMeasureGroupingContent>) => UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(unitOfMeasureGroupingContent));
        });
  };


  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
    .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
    };
  }

  export const unitOfMeasureGroupingRepository: UnitOfMeasureGrouping = new UnitOfMeasureGroupingRepository();