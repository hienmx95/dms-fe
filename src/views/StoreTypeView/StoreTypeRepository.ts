import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_STORE_TYPE_ROUTE} from 'config/api-consts';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Color } from 'models/Color';
import { ColorFilter } from 'models/ColorFilter';

export class StoreTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_TYPE_ROUTE));
  }

  public count = (storeTypeFilter?: StoreTypeFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), storeTypeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (storeTypeFilter?: StoreTypeFilter): Promise<StoreType[]> => {
    return this.http.post<StoreType[]>(kebabCase(nameof(this.list)), storeTypeFilter)
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data?.map((storeType: PureModelData<StoreType>) =>  StoreType.clone<StoreType>(storeType));
    });
  };

  public get = (id: number | string): Promise<StoreType> => {
    return this.http.post<StoreType>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<StoreType>) => StoreType.clone<StoreType>(response.data));
  };

  public create = (storeType: StoreType): Promise<StoreType> => {
    return this.http.post<StoreType>(kebabCase(nameof(this.create)), storeType)
      .then((response: AxiosResponse<PureModelData<StoreType>>) => StoreType.clone<StoreType>(response.data));
  };

  public update = (storeType: StoreType): Promise<StoreType> => {
    return this.http.post<StoreType>(kebabCase(nameof(this.update)), storeType)
      .then((response: AxiosResponse<StoreType>) => StoreType.clone<StoreType>(response.data));
  };

  public delete = (storeType: StoreType): Promise<StoreType> => {
      return this.http.post<StoreType>(kebabCase(nameof(this.delete)), storeType)
        .then((response: AxiosResponse<StoreType>) => StoreType.clone<StoreType>(response.data));
  };

  public save = (storeType: StoreType): Promise<StoreType> => {
      return storeType.id ? this.update(storeType) : this.create(storeType);
  };

  public singleListStatus = (): Promise<Status[]> =>
  {
      return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
        .then((response: AxiosResponse<Status[]>) => {
          return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };

  public singleListColor = (): Promise<Color[]> =>
  {
      return this.http.post<Color[]>(kebabCase(nameof(this.singleListColor)), new ColorFilter())
        .then((response: AxiosResponse<Color[]>) => {
          return response.data.map((color: PureModelData<Color>) => Status.clone<Color>(color));
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
    public export = (
      storeTypeFilter?: StoreTypeFilter,
    ): Promise<AxiosResponse<any>> => {
      return this.http.post('export', storeTypeFilter, {
        responseType: 'arraybuffer',
      });
    };
  }

  export const storeTypeRepository: StoreType = new StoreTypeRepository();