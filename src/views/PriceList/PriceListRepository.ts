import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { RequestStateStatus } from 'models/RequestStateStatus';
import { AppUserFilter } from 'models/AppUserFilter';
import { FileModel } from 'models/ChatBox/FileModel';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import { Repository } from 'core/repositories/Repository';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { API_PRICELIST_ROUTE, POST_ROUTE } from 'config/api-consts';
import { kebabCase } from 'lodash';
import { PriceListFilter } from 'models/priceList/PriceListFilter';
import {
  PriceList,
  PriceListTypeFilter,
  SalesOrderTypeFilter,
  SalesOrderType,
  PriceListType,
  PriceListItemHistory,
  PriceListItemHistoryFilter,
  PriceListItemMappings,
  PriceListStoreMappings,
} from 'models/priceList/PriceList';
import nameof from 'ts-nameof.macro';
import { AxiosResponse } from 'axios';
import { StatusFilter } from 'models/StatusFilter';
import { Status } from 'models/Status';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { buildTree } from 'helpers/tree';
import { BatchId, PureModelData } from 'react3l';
import { StoreFilter } from 'models/StoreFilter';
import { Store } from 'models/Store';
import Item from 'antd/lib/list/Item';
import { ItemFilter } from 'models/ItemFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Province } from 'models/Province';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { ProductType } from 'models/ProductType';
import { Organization } from 'models/Organization';
import { AppUser } from 'models/AppUser';

export class PriceListRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PRICELIST_ROUTE));
  }

  list = (filter: PriceListFilter) => {
    return this.http
      .post<PriceList[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<PriceList[]>) =>
        response.data.map((item: PriceList) =>
          PriceList.clone<PriceList>(item),
        ),
      );
  };

  count = (filter: PriceListFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  get = (id: number) => {
    return this.http
      .post<PriceList>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<PriceList>) =>
        PriceList.clone<PriceList>(response.data),
      );
  };

  getDetail = (id: number) => {
    return this.http
      .post<PriceList>(kebabCase(nameof(this.getDetail)), { id })
      .then((response: AxiosResponse<PriceList>) =>
        PriceList.clone<PriceList>(response.data),
      );
  };

  public create = (priceList: PriceList): Promise<PriceList> => {
    return this.http
      .post<PriceList>(kebabCase(nameof(this.create)), priceList)
      .then((response: AxiosResponse<PureModelData<PriceList>>) =>
        PriceList.clone<PriceList>(response.data),
      );
  };

  public update = (priceList: PriceList): Promise<PriceList> => {
    return this.http
      .post<PriceList>(kebabCase(nameof(this.update)), priceList)
      .then((response: AxiosResponse<PriceList>) =>
        PriceList.clone<PriceList>(response.data),
      );
  };

  public delete = (priceList: PriceList): Promise<PriceList> => {
    return this.http
      .post<PriceList>(kebabCase(nameof(this.delete)), priceList)
      .then((response: AxiosResponse<PriceList>) =>
        PriceList.clone<PriceList>(response.data),
      );
  };

  public save = (priceList: PriceList): Promise<PriceList> => {
    return priceList.id ? this.update(priceList) : this.create(priceList);
  };

  filterListStatus = (filter: StatusFilter) => {
    return this.http
      .post<Status[]>(kebabCase(nameof(this.filterListStatus)), filter)
      .then((response: AxiosResponse<Status[]>) =>
        response.data.map((item: Status) => Status.clone<Status>(item)),
      );
  };
  singleListStatus = () => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) =>
        response.data.map((item: Status) => Status.clone<Status>(item)),
      );
  };

  filterListOrganization = (filter: OrganizationFilter) => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<Organization[]>) =>
        buildTree(
          response.data.map((item: Organization) =>
            Organization.clone<Organization>(item),
          ),
        ),
      );
  };
  singleListOrganization = (filter: OrganizationFilter) => {
    return this.http
      .post<OrganizationFilter[]>(
        kebabCase(nameof(this.singleListOrganization)),
        filter,
      )
      .then((response: AxiosResponse<OrganizationFilter[]>) =>
        buildTree(
          response.data.map((item: OrganizationFilter) =>
            OrganizationFilter.clone<OrganizationFilter>(item),
          ),
        ),
      );
  };

  filterListPriceListType = (filter: PriceListTypeFilter) => {
    return this.http
      .post<PriceListType[]>(
        kebabCase(nameof(this.filterListPriceListType)),
        filter,
      )
      .then((response: AxiosResponse<PriceListType[]>) =>
        response.data.map((item: PriceListType) =>
          PriceListType.clone<PriceListType>(item),
        ),
      );
  };

  filterListStoreGrouping = (filter: StoreGroupingFilter) => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.filterListStoreGrouping)),
        filter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) =>
        response.data.map((item: StoreGrouping) =>
          StoreGrouping.clone<StoreGrouping>(item),
        ),
      );
  };

  filterListStoreType = (filter: StoreTypeFilter) => {
    return this.http
      .post<StoreType[]>(kebabCase(nameof(this.filterListStoreType)), filter)
      .then((response: AxiosResponse<StoreType[]>) =>
        response.data.map((item: StoreType) =>
          StoreType.clone<StoreType>(item),
        ),
      );
  };

  filterListSalesOrderType = (filter: SalesOrderTypeFilter) => {
    return this.http
      .post<SalesOrderType[]>(
        kebabCase(nameof(this.filterListSalesOrderType)),
        filter,
      )
      .then((response: AxiosResponse<SalesOrderType[]>) =>
        response.data.map((item: SalesOrderType) =>
          SalesOrderType.clone<SalesOrderType>(item),
        ),
      );
  };
  singleListSalesOrderType = (filter: SalesOrderTypeFilter) => {
    return this.http
      .post<SalesOrderType[]>(
        kebabCase(nameof(this.singleListSalesOrderType)),
        filter,
      )
      .then((response: AxiosResponse<SalesOrderType[]>) =>
        response.data.map((item: SalesOrderType) =>
          SalesOrderType.clone<SalesOrderType>(item),
        ),
      );
  };

  singleListPriceListType = (filter: PriceListTypeFilter) => {
    return this.http
      .post<PriceListType[]>(
        kebabCase(nameof(this.singleListPriceListType)),
        filter,
      )
      .then((response: AxiosResponse<PriceListType[]>) =>
        response.data.map((item: PriceListType) =>
          PriceListType.clone<PriceListType>(item),
        ),
      );
  };

  singleListStore = (filter: StoreFilter) => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.singleListStore)), filter)
      .then((response: AxiosResponse<Store[]>) =>
        response.data.map((item: Store) => Store.clone<Store>(item)),
      );
  };

  singleListStoreType = (filter: StoreTypeFilter) => {
    return this.http
      .post<StoreType[]>(kebabCase(nameof(this.singleListStoreType)), filter)
      .then((response: AxiosResponse<StoreType[]>) =>
        response.data.map((item: StoreType) =>
          StoreType.clone<StoreType>(item),
        ),
      );
  };

  singleListStoreGrouping = (filter: StoreGroupingFilter) => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.singleListStoreGrouping)),
        filter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) =>
        response.data.map((item: StoreGrouping) =>
          StoreGrouping.clone<StoreGrouping>(item),
        ),
      );
  };

  singleListProductType = (filter: ProductTypeFilter) => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.singleListProductType)),
        filter,
      )
      .then((response: AxiosResponse<ProductType[]>) =>
        response.data.map((item: ProductType) =>
          ProductType.clone<ProductType>(item),
        ),
      );
  };

  singleListProductGrouping = (filter: ProductGroupingFilter) => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.singleListProductGrouping)),
        filter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((item: StoreGrouping) =>
            StoreGrouping.clone<StoreGrouping>(item),
          ),
        );
      });
  };

  singleListProvince = (filter: ProvinceFilter) => {
    return this.http
      .post<Province[]>(kebabCase(nameof(this.singleListProvince)), filter)
      .then((response: AxiosResponse<Province[]>) =>
        response.data.map((item: Province) => Province.clone<Province>(item)),
      );
  };

  listStore = (filter: StoreFilter) => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listStore)), filter)
      .then((response: AxiosResponse<Store[]>) =>
        response.data.map((item: Store) => Store.clone<Store>(item)),
      );
  };

  countStore = (filter: StoreFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  listPriceListItemHistory = (filter: PriceListItemHistoryFilter) => {
    return this.http
      .post<PriceListItemHistory[]>(
        kebabCase(nameof(this.listPriceListItemHistory)),
        filter,
      )
      .then((response: AxiosResponse<PriceListItemHistory[]>) =>
        response.data.map((item: PriceListItemHistory) =>
          PriceListItemHistory.clone<PriceListItemHistory>(item),
        ),
      );
  };

  countPriceListItemHistory = (filter: PriceListItemHistoryFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.countPriceListItemHistory)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  listItem = (filter: ItemFilter) => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.listItem)), filter)
      .then((response: AxiosResponse<Item[]>) =>
        response.data.map((item: Item) => Store.clone<Item>(item)),
      );
  };

  countItem = (filter: ItemFilter) => {
    return this.http
      .post<number>(kebabCase(nameof(this.countItem)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public importStore = (
    file: File,
    priceListId: number,
  ): Promise<PriceListStoreMappings[]> => {
    const formData: FormData = new FormData();
    formData.append(nameof(file), file);
    formData.append(
      nameof(priceListId),
      typeof priceListId !== 'undefined' ? priceListId.toString() : '0', // if create case, send priceListId = 0 to server
    );
    return this.http
      .post<PriceListStoreMappings[]>(
        kebabCase(nameof(this.importStore)),
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(
        (response: AxiosResponse<PriceListStoreMappings[]>) => response.data,
      );
  };

  public exportStore = (model?: PriceList): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.exportStore)), model, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplateStore = (
    id: number | string,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post(
      kebabCase(nameof(this.exportTemplateStore)),
      { id },
      {
        responseType: 'arraybuffer',
      },
    );
  };

  public importItem = (
    file: File,
    priceListId: number,
  ): Promise<PriceListItemMappings[]> => {
    const formData: FormData = new FormData();
    formData.append(nameof(file), file);
    formData.append(
      nameof(priceListId),
      typeof priceListId !== 'undefined' ? priceListId.toString() : '0',
    );
    return this.http
      .post<PriceListItemMappings[]>(
        kebabCase(nameof(this.importItem)),
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(
        (response: AxiosResponse<PriceListItemMappings[]>) => response.data,
      );
  };

  public exportItem = (model?: PriceList): Promise<AxiosResponse<any>> => {
    return this.http.post(kebabCase(nameof(this.exportItem)), model, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplateItem = (
    id: number | string,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post(
      kebabCase(nameof(this.exportTemplateItem)),
      { id },
      {
        responseType: 'arraybuffer',
      },
    );
  };

  public createPost = (model: Post) => {
    return this.http
      .post<Post>(kebabCase(nameof(this.create)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public listPost = (filter: PostFilter) => {
    return this.http
      .post<Post[]>(kebabCase(nameof(this.list)), filter, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post[]>) => {
        return response.data.map((item: PureModelData<Post>) =>
          Post.clone<Post>(item),
        );
      });
  };
  public countPost = (filter: PostFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public deletePost = (model: Post): Promise<Post> => {
    return this.http
      .post<Post>(kebabCase(nameof(this.delete)), model, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
      })
      .then((response: AxiosResponse<Post>) => Post.clone<Post>(response.data));
  };

  public saveFile = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<FileModel> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post<Post>(kebabCase(nameof(this.saveFile)), formData, {
        baseURL: url(API_BASE_URL, POST_ROUTE),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
      })
      .then((response: AxiosResponse<FileModel>) => response.data);
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

  public filterListRequestState = (): Promise<RequestStateStatus[]> => {
    return this.http
      .post<RequestStateStatus[]>(
        kebabCase(nameof(this.filterListRequestState)),
        new RequestStateStatusFilter(),
      )
      .then((response: AxiosResponse<RequestStateStatus[]>) => {
        return response.data.map(
          (requestStateStatus: PureModelData<RequestStateStatus>) =>
            RequestStateStatus.clone<RequestStateStatus>(requestStateStatus),
        );
      });
  };
}

export const priceListRepository: PriceList = new PriceListRepository();
