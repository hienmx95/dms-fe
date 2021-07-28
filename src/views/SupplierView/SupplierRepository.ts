import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_SUPPLIER_ROUTE } from 'config/api-consts';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { NationFilter } from 'models/NationFilter';
import { Nation } from 'models/Nation';

export class SupplierRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SUPPLIER_ROUTE));
  }

  public count = (supplierFilter?: SupplierFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), supplierFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (supplierFilter?: SupplierFilter): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(kebabCase(nameof(this.list)), supplierFilter)
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data?.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };

  public get = (id: number | string): Promise<Supplier> => {
    return this.http
      .post<Supplier>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Supplier>) =>
        Supplier.clone<Supplier>(response.data),
      );
  };

  public create = (supplier: Supplier): Promise<Supplier> => {
    return this.http
      .post<Supplier>(kebabCase(nameof(this.create)), supplier)
      .then((response: AxiosResponse<PureModelData<Supplier>>) =>
        Supplier.clone<Supplier>(response.data),
      );
  };

  public update = (supplier: Supplier): Promise<Supplier> => {
    return this.http
      .post<Supplier>(kebabCase(nameof(this.update)), supplier)
      .then((response: AxiosResponse<Supplier>) =>
        Supplier.clone<Supplier>(response.data),
      );
  };

  public delete = (supplier: Supplier): Promise<Supplier> => {
    return this.http
      .post<Supplier>(kebabCase(nameof(this.delete)), supplier)
      .then((response: AxiosResponse<Supplier>) =>
        Supplier.clone<Supplier>(response.data),
      );
  };

  public save = (supplier: Supplier): Promise<Supplier> => {
    return supplier.id ? this.update(supplier) : this.create(supplier);
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
  public singleListPersonInCharge = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.singleListPersonInCharge)),
        appUserFilter,
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
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

  public singleListNation = (nationFilter: NationFilter): Promise<Nation[]> => {
    return this.http
      .post<Nation[]>(kebabCase(nameof(this.singleListNation)), nationFilter)
      .then((response: AxiosResponse<Nation[]>) => {
        return response.data.map((nation: PureModelData<Nation>) =>
          Nation.clone<Nation>(nation),
        );
      });
  };
}

export const supplierRepository: Supplier = new SupplierRepository();
