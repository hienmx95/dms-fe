import { KpiProductGroupingFilter } from 'models/kpi/KpiProductGroupingFilter';
import { KpiProductGrouping } from 'models/kpi/KpiProductGrouping';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_KPI_PRODUCT_GROUPING_ROUTE } from 'config/api-consts';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';

import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { KpiPeriod } from 'models/kpi/KpiPeriod';
import { KpiPeriodFilter } from 'models/kpi/KpiPeriodFilter';
import { KpiItemContentFilter } from 'models/kpi/KpiItemContentFilter';
import { KpiItemContent } from 'models/kpi/KpiItemContent';
import { KpiItemKpiCriteriaTotalMappingFilter } from 'models/kpi/KpiItemKpiCriteriaTotalMappingFilter';
import { KpiItemKpiCriteriaTotalMapping } from 'models/kpi/KpiItemKpiCriteriaTotalMapping';
import { KpiCriteriaTotal } from 'models/kpi/KpiCriteriaTotal';
import { KpiCriteriaTotalFilter } from 'models/kpi/KpiCriteriaTotalFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { buildTree } from 'helpers/tree';
import { SupplierFilter } from 'models/SupplierFilter';
import { Supplier } from 'models/Supplier';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { ProductType } from 'models/ProductType';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { CategoryFilter } from 'models/Category';
import { Category } from 'models/Category';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';

export class KpiItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_KPI_PRODUCT_GROUPING_ROUTE));
  }

  public count = (
    kpiProductGroupingFilter?: KpiProductGroupingFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), kpiProductGroupingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    kpiProductGroupingFilter?: KpiProductGroupingFilter,
  ): Promise<KpiProductGrouping[]> => {
    return this.http
      .post<KpiProductGrouping[]>(
        kebabCase(nameof(this.list)),
        kpiProductGroupingFilter,
      )
      .then((response: AxiosResponse<KpiProductGrouping[]>) => {
        return response.data?.map(
          (kpiProductGrouping: PureModelData<KpiProductGrouping>) =>
            KpiProductGrouping.clone<KpiProductGrouping>(kpiProductGrouping),
        );
      });
  };
  public get = (id: number | string): Promise<KpiProductGrouping> => {
    return this.http
      .post<KpiProductGrouping>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<KpiProductGrouping>) =>
        KpiProductGrouping.clone<KpiProductGrouping>(response.data),
      );
  };

  public getDraft = (): Promise<KpiProductGrouping> => {
    return this.http
      .post<KpiProductGrouping>(kebabCase(nameof(this.getDraft)))
      .then((response: AxiosResponse<KpiProductGrouping>) =>
        KpiProductGrouping.clone<KpiProductGrouping>(response.data),
      );
  };

  public create = (
    kpiItem: KpiProductGrouping,
  ): Promise<KpiProductGrouping> => {
    return this.http
      .post<KpiProductGrouping>(kebabCase(nameof(this.create)), kpiItem)
      .then((response: AxiosResponse<PureModelData<KpiProductGrouping>>) =>
        KpiProductGrouping.clone<KpiProductGrouping>(response.data),
      );
  };

  public update = (
    kpiProductGrouping: KpiProductGrouping,
  ): Promise<KpiProductGrouping> => {
    return this.http
      .post<KpiProductGrouping>(
        kebabCase(nameof(this.update)),
        kpiProductGrouping,
      )
      .then((response: AxiosResponse<KpiProductGrouping>) =>
        KpiProductGrouping.clone<KpiProductGrouping>(response.data),
      );
  };

  public delete = (
    kpiProductGrouping: KpiProductGrouping,
  ): Promise<KpiProductGrouping> => {
    return this.http
      .post<KpiProductGrouping>(
        kebabCase(nameof(this.delete)),
        kpiProductGrouping,
      )
      .then((response: AxiosResponse<KpiProductGrouping>) =>
        KpiProductGrouping.clone<KpiProductGrouping>(response.data),
      );
  };

  public save = (kpiItem: KpiProductGrouping): Promise<KpiProductGrouping> => {
    return kpiItem.id ? this.update(kpiItem) : this.create(kpiItem);
  };

  public singleListAppUser = (): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(
        kebabCase(nameof(this.singleListAppUser)),
        new AppUserFilter(),
      )
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
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
  public singleListKpiPeriod = (): Promise<KpiPeriod[]> => {
    return this.http
      .post<KpiPeriod[]>(
        kebabCase(nameof(this.singleListKpiPeriod)),
        new KpiPeriodFilter(),
      )
      .then((response: AxiosResponse<KpiPeriod[]>) => {
        return response.data.map((kpiPeriod: PureModelData<KpiPeriod>) =>
          KpiPeriod.clone<KpiPeriod>(kpiPeriod),
        );
      });
  };

  public filterListKpiPeriod = (): Promise<KpiPeriod[]> => {
    return this.http
      .post<KpiPeriod[]>(
        kebabCase(nameof(this.filterListKpiPeriod)),
        new KpiPeriodFilter(),
      )
      .then((response: AxiosResponse<KpiPeriod[]>) => {
        return response.data.map((kpiPeriod: PureModelData<KpiPeriod>) =>
          KpiPeriod.clone<KpiPeriod>(kpiPeriod),
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
  public singleListKpiItemContent = (
    kpiItemContentFilter: KpiItemContentFilter,
  ): Promise<KpiItemContent[]> => {
    return this.http
      .post<KpiItemContent[]>(
        kebabCase(nameof(this.singleListKpiItemContent)),
        kpiItemContentFilter,
      )
      .then((response: AxiosResponse<KpiItemContent[]>) => {
        return response.data.map(
          (kpiItemContent: PureModelData<KpiItemContent>) =>
            KpiItemContent.clone<KpiItemContent>(kpiItemContent),
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
  public singleListKpiItemKpiCriteriaTotalMapping = (
    kpiItemKpiCriteriaTotalMappingFilter: KpiItemKpiCriteriaTotalMappingFilter,
  ): Promise<KpiItemKpiCriteriaTotalMapping[]> => {
    return this.http
      .post<KpiItemKpiCriteriaTotalMapping[]>(
        kebabCase(nameof(this.singleListKpiItemKpiCriteriaTotalMapping)),
        kpiItemKpiCriteriaTotalMappingFilter,
      )
      .then((response: AxiosResponse<KpiItemKpiCriteriaTotalMapping[]>) => {
        return response.data.map(
          (
            kpiItemKpiCriteriaTotalMapping: PureModelData<
              KpiItemKpiCriteriaTotalMapping
            >,
          ) =>
            KpiItemKpiCriteriaTotalMapping.clone<
              KpiItemKpiCriteriaTotalMapping
            >(kpiItemKpiCriteriaTotalMapping),
        );
      });
  };
  public singleListKpiCriteriaTotal = (): Promise<KpiCriteriaTotal[]> => {
    return this.http
      .post<KpiCriteriaTotal[]>(
        kebabCase(nameof(this.singleListKpiCriteriaTotal)),
        new KpiCriteriaTotalFilter(),
      )
      .then((response: AxiosResponse<KpiCriteriaTotal[]>) => {
        return response.data.map(
          (kpiCriteriaTotal: PureModelData<KpiCriteriaTotal>) =>
            KpiCriteriaTotal.clone<KpiCriteriaTotal>(kpiCriteriaTotal),
        );
      });
  };

  public countKpiCriteriaTotal = (
    kpiCriteriaTotalFilter: KpiCriteriaTotalFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countKpiCriteriaTotal)),
        kpiCriteriaTotalFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listKpiCriteriaTotal = (
    kpiCriteriaTotalFilter: KpiCriteriaTotalFilter,
  ): Promise<KpiCriteriaTotal[]> => {
    return this.http
      .post<KpiCriteriaTotal[]>(
        kebabCase(nameof(this.listKpiCriteriaTotal)),
        kpiCriteriaTotalFilter,
      )
      .then((response: AxiosResponse<KpiCriteriaTotal[]>) => {
        return response.data.map(
          (kpiCriteriaTotal: PureModelData<KpiCriteriaTotal>) =>
            KpiCriteriaTotal.clone<KpiCriteriaTotal>(kpiCriteriaTotal),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };
  public countAppUser = (appUserFilter: AppUserFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };
  public listAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
  public filterListKpiYear = (): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(
        kebabCase(nameof(this.filterListKpiYear)),
        new KpiYearFilter(),
      )
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((kpiYear: PureModelData<KpiYear>) =>
          KpiYear.clone<KpiYear>(kpiYear),
        );
      });
  };
  public singleListKpiYear = (): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(
        kebabCase(nameof(this.singleListKpiYear)),
        new KpiYearFilter(),
      )
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((kpiYear: PureModelData<KpiYear>) =>
          KpiYear.clone<KpiYear>(kpiYear),
        );
      });
  };

  public countItem = (itemFilter: ItemFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countItem)), itemFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };
  public listItem = (itemFilter: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.listItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data.map((item: PureModelData<Item>) =>
          Item.clone<Item>(item),
        );
      });
  };
  public filterListSupplier = (
    supplierFilter: SupplierFilter,
  ): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(
        kebabCase(nameof(this.filterListSupplier)),
        supplierFilter,
      )
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };
  public filterListProductType = (
    productTypeFilter: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.filterListProductType)),
        productTypeFilter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
        );
      });
  };
  public filterListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.filterListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
        );
      });
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
  public export = (
    kpiItemFilter?: KpiProductGroupingFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', kpiItemFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    kpiItemFilter?: KpiProductGroupingFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', kpiItemFilter, {
      responseType: 'arraybuffer',
    });
  };

  public singleListKpiProductGroupingType = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListKpiProductGroupingType)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public filterListKpiProductGroupingType = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListKpiProductGroupingType)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public singleListProductGrouping = (
    productGroupingFilter?: ProductGroupingFilter,
  ): Promise<ProductGrouping[]> => {
    return this.http
      .post<ProductGrouping[]>(
        kebabCase(nameof(this.singleListProductGrouping)),
        productGroupingFilter,
      )
      .then((response: AxiosResponse<ProductGrouping[]>) => {
        return buildTree(
          response.data.map((productGrouping: PureModelData<ProductGrouping>) =>
            ProductGrouping.clone<ProductGrouping>(productGrouping),
          ),
        );
      });
  };

  public filterListCategory = (
    categoryFilter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(
        kebabCase(nameof(this.filterListCategory)),
        categoryFilter,
      )
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((category: PureModelData<Category>) =>
            Category.clone<Category>(category),
          ),
        );
      });
  };
  public filterListBrand = (brandFilter?: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.filterListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };
}

export const kpiItemRepository: KpiProductGrouping = new KpiItemRepository();
