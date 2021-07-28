import { AxiosResponse } from 'axios';
import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
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
import { ShowingCategory } from 'models/posm/ShowingCategory';
import { ShowingCategoryFilter } from 'models/posm/ShowingCategoryFilter';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { ShowingOrder } from 'models/posm/ShowingOrder';
import { ShowingOrderContent } from 'models/posm/ShowingOrderContent';
import { ShowingOrderContentFilter } from 'models/posm/ShowingOrderContentFilter';
import { ShowingOrderFilter } from 'models/posm/ShowingOrderFilter';
import { ShowingWarehouse } from 'models/posm/ShowingWarehouse';
import { ShowingWarehouseFilter } from 'models/posm/ShowingWarehouseFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class ShowingOrderRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SHOWING_ORDER_ROUTE));
  }

  public count = (showingOrderFilter?: ShowingOrderFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), showingOrderFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    showingOrderFilter?: ShowingOrderFilter,
  ): Promise<ShowingOrder[]> => {
    return this.http
      .post<ShowingOrder[]>(kebabCase(nameof(this.list)), showingOrderFilter)
      .then((response: AxiosResponse<ShowingOrder[]>) => {
        return response.data?.map((showingOrder: PureModelData<ShowingOrder>) =>
          ShowingOrder.clone<ShowingOrder>(showingOrder),
        );
      });
  };

  public get = (id: number | string): Promise<ShowingOrder> => {
    return this.http
      .post<ShowingOrder>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ShowingOrder>) =>
        ShowingOrder.clone<ShowingOrder>(response.data),
      );
  };

  public create = (showingOrder: ShowingOrder): Promise<ShowingOrder> => {
    return this.http
      .post<ShowingOrder>(kebabCase(nameof(this.create)), showingOrder)
      .then((response: AxiosResponse<PureModelData<ShowingOrder>>) =>
        ShowingOrder.clone<ShowingOrder>(response.data),
      );
  };

  public update = (showingOrder: ShowingOrder): Promise<ShowingOrder> => {
    return this.http
      .post<ShowingOrder>(kebabCase(nameof(this.update)), showingOrder)
      .then((response: AxiosResponse<ShowingOrder>) =>
        ShowingOrder.clone<ShowingOrder>(response.data),
      );
  };

  public delete = (showingOrder: ShowingOrder): Promise<ShowingOrder> => {
    return this.http
      .post<ShowingOrder>(kebabCase(nameof(this.delete)), showingOrder)
      .then((response: AxiosResponse<ShowingOrder>) =>
        ShowingOrder.clone<ShowingOrder>(response.data),
      );
  };

  public save = (showingOrder: ShowingOrder): Promise<ShowingOrder> => {
    return showingOrder.id
      ? this.update(showingOrder)
      : this.create(showingOrder);
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
      .post<UnitOfMeasure[]>(
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
  public singleListShowingOrderContent = (
    showingOrderContentFilter: ShowingOrderContentFilter,
  ): Promise<ShowingOrderContent[]> => {
    return this.http
      .post<ShowingOrderContent[]>(
        kebabCase(nameof(this.singleListShowingOrderContent)),
        showingOrderContentFilter,
      )
      .then((response: AxiosResponse<ShowingOrderContent[]>) => {
        return response.data.map(
          (showingOrderContent: PureModelData<ShowingOrderContent>) =>
            ShowingOrderContent.clone<ShowingOrderContent>(showingOrderContent),
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

  public filterListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public singleListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.singleListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public filterListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };

  public singleListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
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

  public filterListShowingItem = (
    filter: ShowingItemFilter,
  ): Promise<ShowingItem[]> => {
    return this.http
      .post<ShowingItem[]>(
        kebabCase(nameof(this.filterListShowingItem)),
        filter,
      )
      .then((response: AxiosResponse<ShowingItem[]>) => {
        return response.data.map((showingItem: PureModelData<ShowingItem>) =>
          ShowingItem.clone<ShowingItem>(showingItem),
        );
      });
  };

  public singleListShowingWarehouse = (
    filter: ShowingWarehouseFilter,
  ): Promise<ShowingWarehouse[]> => {
    return this.http
      .post<ShowingWarehouse[]>(
        kebabCase(nameof(this.singleListShowingWarehouse)),
        filter,
      )
      .then((response: AxiosResponse<ShowingWarehouse[]>) => {
        return response.data.map(
          (showingWarehouse: PureModelData<ShowingWarehouse>) =>
            ShowingWarehouse.clone<ShowingWarehouse>(showingWarehouse),
        );
      });
  };

  public countStore = (storeFilter?: StoreFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listStore = (storeFilter?: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data?.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
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

  public countShowingItem = (filter?: ShowingItemFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countShowingItem)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listShowingItem = (
    filter?: ShowingItemFilter,
  ): Promise<ShowingItem[]> => {
    return this.http
      .post<ShowingItem[]>(kebabCase(nameof(this.listShowingItem)), filter)
      .then((response: AxiosResponse<ShowingItem[]>) => {
        return response.data?.map((showingItem: PureModelData<ShowingItem>) =>
          ShowingItem.clone<ShowingItem>(showingItem),
        );
      });
  };

  public export = (
    filter?: ShowingOrderFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', filter, {
      responseType: 'arraybuffer',
    });
  };
}

export const showingOrderRepository: ShowingOrder = new ShowingOrderRepository();
