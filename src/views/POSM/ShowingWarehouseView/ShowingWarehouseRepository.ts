import { AxiosResponse } from 'axios';
import { API_SHOWING_WAREHOUSE_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Inventory } from 'models/Inventory';
import { InventoryFilter } from 'models/InventoryFilter';
import { InventoryHistory } from 'models/InventoryHistory';
import { InventoryHistoryFilter } from 'models/InventoryHistoryFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { ShowingWarehouse } from 'models/posm/ShowingWarehouse';
import { ShowingWarehouseFilter } from 'models/posm/ShowingWarehouseFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';

export class ShowingWarehouseRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SHOWING_WAREHOUSE_ROUTE));
  }

  public count = (
    warehouseFilter?: ShowingWarehouseFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), warehouseFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    warehouseFilter?: ShowingWarehouseFilter,
  ): Promise<ShowingWarehouse[]> => {
    return this.http
      .post<ShowingWarehouse[]>(kebabCase(nameof(this.list)), warehouseFilter)
      .then((response: AxiosResponse<ShowingWarehouse[]>) => {
        return response.data?.map(
          (warehouse: PureModelData<ShowingWarehouse>) =>
            ShowingWarehouse.clone<ShowingWarehouse>(warehouse),
        );
      });
  };
  public countHistory = (
    inventoryHistoryFilter?: InventoryHistoryFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countHistory)),
        inventoryHistoryFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listHistory = (
    inventoryHistoryFilter?: InventoryHistoryFilter,
  ): Promise<InventoryHistory[]> => {
    return this.http
      .post<InventoryHistory[]>(
        kebabCase(nameof(this.listHistory)),
        inventoryHistoryFilter,
      )
      .then((response: AxiosResponse<InventoryHistory[]>) => {
        return response.data?.map(
          (inventoryHistory: PureModelData<InventoryHistory>) =>
            ShowingWarehouse.clone<InventoryHistory>(inventoryHistory),
        );
      });
  };

  public get = (id: number | string): Promise<ShowingWarehouse> => {
    return this.http
      .post<ShowingWarehouse>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<ShowingWarehouse>) =>
        ShowingWarehouse.clone<ShowingWarehouse>(response.data),
      );
  };

  public getPreview = (id: number | string): Promise<ShowingWarehouse> => {
    return this.http
      .post<ShowingWarehouse>(kebabCase(nameof(this.getPreview)), { id })
      .then((response: AxiosResponse<ShowingWarehouse>) =>
        ShowingWarehouse.clone<ShowingWarehouse>(response.data),
      );
  };

  public create = (warehouse: ShowingWarehouse): Promise<ShowingWarehouse> => {
    return this.http
      .post<ShowingWarehouse>(kebabCase(nameof(this.create)), warehouse)
      .then((response: AxiosResponse<PureModelData<ShowingWarehouse>>) =>
        ShowingWarehouse.clone<ShowingWarehouse>(response.data),
      );
  };

  public update = (warehouse: ShowingWarehouse): Promise<ShowingWarehouse> => {
    return this.http
      .post<ShowingWarehouse>(kebabCase(nameof(this.update)), warehouse)
      .then((response: AxiosResponse<ShowingWarehouse>) =>
        ShowingWarehouse.clone<ShowingWarehouse>(response.data),
      );
  };

  public delete = (warehouse: ShowingWarehouse): Promise<ShowingWarehouse> => {
    return this.http
      .post<ShowingWarehouse>(kebabCase(nameof(this.delete)), warehouse)
      .then((response: AxiosResponse<ShowingWarehouse>) =>
        ShowingWarehouse.clone<ShowingWarehouse>(response.data),
      );
  };

  public save = (warehouse: ShowingWarehouse): Promise<ShowingWarehouse> => {
    return warehouse.id ? this.update(warehouse) : this.create(warehouse);
  };

  public singleListDistrict = (
    districtFilter: DistrictFilter,
  ): Promise<District[]> => {
    return this.http
      .post<District[]>(
        kebabCase(nameof(this.singleListDistrict)),
        districtFilter,
      )
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) =>
          District.clone<District>(district),
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
  public singleListProvince = (
    provinceFilter: ProvinceFilter,
  ): Promise<Province[]> => {
    return this.http
      .post<Province[]>(
        kebabCase(nameof(this.singleListProvince)),
        provinceFilter,
      )
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
        );
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
  public singleListWard = (wardFilter: WardFilter): Promise<Ward[]> => {
    return this.http
      .post<Ward[]>(kebabCase(nameof(this.singleListWard)), wardFilter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data.map((ward: PureModelData<Ward>) =>
          Ward.clone<Ward>(ward),
        );
      });
  };
  public singleListInventory = (
    inventoryFilter: InventoryFilter,
  ): Promise<Inventory[]> => {
    return this.http
      .post<Inventory[]>(
        kebabCase(nameof(this.singleListInventory)),
        inventoryFilter,
      )
      .then((response: AxiosResponse<Inventory[]>) => {
        return response.data.map((inventory: PureModelData<Inventory>) =>
          Inventory.clone<Inventory>(inventory),
        );
      });
  };
  public singleListItem = (itemFilter: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.singleListItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data.map((item: PureModelData<Item>) =>
          Item.clone<Item>(item),
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

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (
    file: File,
    filter?: InventoryFilter,
    name: string = nameof(file),
  ): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    formData.append(`showingWarehouseId`, `${filter.id.equal}`);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    warehouseFilter?: ShowingWarehouseFilter,
  ): Promise<AxiosResponse<any>> => {
    const id = Number(warehouseFilter.id.equal);
    return this.http.post(
      'export',
      { id },
      {
        responseType: 'arraybuffer',
      },
    );
  };

  public exportTemplate = (
    warehouseFilter?: ShowingWarehouseFilter,
  ): Promise<AxiosResponse<any>> => {
    const id = Number(warehouseFilter.id.equal);
    return this.http.post(
      'export-template',
      { id },
      {
        responseType: 'arraybuffer',
      },
    );
  };

  public filterListAppUser = (): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.filterListAppUser)),
        new AppUserFilter(),
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
}

export const showingWarehouseRepository: ShowingWarehouse = new ShowingWarehouseRepository();
