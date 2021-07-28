import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_WAREHOUSE_ROUTE } from 'config/api-consts';
import { Warehouse } from 'models/Warehouse';
import { WarehouseFilter } from 'models/WarehouseFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { Inventory } from 'models/Inventory';
import { InventoryFilter } from 'models/InventoryFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { InventoryHistoryFilter } from 'models/InventoryHistoryFilter';
import { InventoryHistory } from 'models/InventoryHistory';
import { buildTree } from 'helpers/tree';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';

export class WarehouseRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_WAREHOUSE_ROUTE));
  }

  public count = (warehouseFilter?: WarehouseFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), warehouseFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (warehouseFilter?: WarehouseFilter): Promise<Warehouse[]> => {
    return this.http
      .post<Warehouse[]>(kebabCase(nameof(this.list)), warehouseFilter)
      .then((response: AxiosResponse<Warehouse[]>) => {
        return response.data?.map((warehouse: PureModelData<Warehouse>) =>
          Warehouse.clone<Warehouse>(warehouse),
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
            Warehouse.clone<InventoryHistory>(inventoryHistory),
        );
      });
  };

  public get = (id: number | string): Promise<Warehouse> => {
    return this.http
      .post<Warehouse>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Warehouse>) =>
        Warehouse.clone<Warehouse>(response.data),
      );
  };

  public getPreview = (id: number | string): Promise<Warehouse> => {
    return this.http
      .post<Warehouse>(kebabCase(nameof(this.getPreview)), { id })
      .then((response: AxiosResponse<Warehouse>) =>
        Warehouse.clone<Warehouse>(response.data),
      );
  };

  public create = (warehouse: Warehouse): Promise<Warehouse> => {
    return this.http
      .post<Warehouse>(kebabCase(nameof(this.create)), warehouse)
      .then((response: AxiosResponse<PureModelData<Warehouse>>) =>
        Warehouse.clone<Warehouse>(response.data),
      );
  };

  public update = (warehouse: Warehouse): Promise<Warehouse> => {
    return this.http
      .post<Warehouse>(kebabCase(nameof(this.update)), warehouse)
      .then((response: AxiosResponse<Warehouse>) =>
        Warehouse.clone<Warehouse>(response.data),
      );
  };

  public delete = (warehouse: Warehouse): Promise<Warehouse> => {
    return this.http
      .post<Warehouse>(kebabCase(nameof(this.delete)), warehouse)
      .then((response: AxiosResponse<Warehouse>) =>
        Warehouse.clone<Warehouse>(response.data),
      );
  };

  public save = (warehouse: Warehouse): Promise<Warehouse> => {
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
    formData.append(`warehouseId`, `${filter.id.equal}`);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };

  public export = (
    warehouseFilter?: WarehouseFilter,
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
    warehouseFilter?: WarehouseFilter,
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
}

export const warehouseRepository: Warehouse = new WarehouseRepository();
