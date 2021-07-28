import { OrganizationFilter } from './../../models/OrganizationFilter';
import { AxiosResponse } from 'axios';
import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { API_LUCKY_NUMBER_ROUTE } from 'config/api-consts';
import kebabCase from 'lodash/kebabCase';
import nameof from 'ts-nameof.macro';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { BatchId, PureModelData } from 'react3l';
import { LuckyNumber } from 'models/LuckyNumber';
import { LuckyNumberFilter } from 'models/LuckyNumberFilter';
import { Organization } from 'models/Organization';
import { buildTree } from 'helpers/tree';
export class LuckyNumberRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_LUCKY_NUMBER_ROUTE));
  }

  public list = (filter?: LuckyNumberFilter): Promise<LuckyNumber[]> => {
    return this.http
      .post<LuckyNumber[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<LuckyNumber[]>) => {
        return response.data?.map((product: PureModelData<LuckyNumber>) =>
          LuckyNumber.clone<LuckyNumber>(product),
        );
      });
  };

  public count = (filter?: LuckyNumberFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public get = (id: number | string): Promise<LuckyNumber> => {
    return this.http
      .post<LuckyNumber>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<LuckyNumber>) =>
        LuckyNumber.clone<LuckyNumber>(response.data),
      );
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (filter: LuckyNumberFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', filter, {
      responseType: 'arraybuffer',
    });
  };

  public exportStore = (
    filter: LuckyNumberFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-store', filter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (): Promise<AxiosResponse<any>> => {
    return this.http.post(
      'export-template',
      {},
      {
        responseType: 'arraybuffer',
      },
    );
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

  public delete = (item: LuckyNumber): Promise<LuckyNumber> => {
    return this.http
      .post<LuckyNumber>(kebabCase(nameof(this.delete)), item)
      .then((response: AxiosResponse<LuckyNumber>) =>
        LuckyNumber.clone<LuckyNumber>(response.data),
      );
  };
  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public filterListRewardStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListRewardStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
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
}

export const luckyNumberRepository = new LuckyNumberRepository();
