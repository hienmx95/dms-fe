import { AxiosResponse } from 'axios';
import { API_STORE_SCOUTING_TYPE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { StoreScoutingType } from 'models/StoreScoutingType';
import { StoreScoutingTypeFilter } from 'models/StoreScoutingTypeFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';


export class StoreScoutingTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STORE_SCOUTING_TYPE_ROUTE));
  }

  public count = (storeScoutingTypeFilter?: StoreScoutingTypeFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), storeScoutingTypeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (storeScoutingTypeFilter?: StoreScoutingTypeFilter): Promise<StoreScoutingType[]> => {
    return this.http.post<StoreScoutingType[]>(kebabCase(nameof(this.list)), storeScoutingTypeFilter)
      .then((response: AxiosResponse<StoreScoutingType[]>) => {
        return response.data?.map((storeScoutingType: PureModelData<StoreScoutingType>) =>  StoreScoutingType.clone<StoreScoutingType>(storeScoutingType));
    });
  };

  public get = (id: number | string): Promise<StoreScoutingType> => {
    return this.http.post<StoreScoutingType>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<StoreScoutingType>) => StoreScoutingType.clone<StoreScoutingType>(response.data));
  };

  public create = (storeScoutingType: StoreScoutingType): Promise<StoreScoutingType> => {
    return this.http.post<StoreScoutingType>(kebabCase(nameof(this.create)), storeScoutingType)
      .then((response: AxiosResponse<PureModelData<StoreScoutingType>>) => StoreScoutingType.clone<StoreScoutingType>(response.data));
  };

  public update = (storeScoutingType: StoreScoutingType): Promise<StoreScoutingType> => {
    return this.http.post<StoreScoutingType>(kebabCase(nameof(this.update)), storeScoutingType)
      .then((response: AxiosResponse<StoreScoutingType>) => StoreScoutingType.clone<StoreScoutingType>(response.data));
  };


  public delete = (storeScoutingType: StoreScoutingType): Promise<StoreScoutingType> => {
      return this.http.post<StoreScoutingType>(kebabCase(nameof(this.delete)), storeScoutingType)
        .then((response: AxiosResponse<StoreScoutingType>) => StoreScoutingType.clone<StoreScoutingType>(response.data));
  };

  public save = (storeScoutingType: StoreScoutingType): Promise<StoreScoutingType> => {
      return storeScoutingType.id ? this.update(storeScoutingType) : this.create(storeScoutingType);
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
    .then((response: AxiosResponse<void>) => response.data);
  };
  public singleListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.singleListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };

  public filterListStatus = (): Promise<Status[]> => {
    return this.http.post<Status[]>(kebabCase(nameof(this.filterListStatus)), new StatusFilter())
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) => Status.clone<Status>(status));
      });
  };
  }

  export const storeScoutingTypeRepository: StoreScoutingTypeRepository = new StoreScoutingTypeRepository();
