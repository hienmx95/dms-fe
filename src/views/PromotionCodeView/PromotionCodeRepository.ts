import { SupplierFilter } from 'models/SupplierFilter';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { buildTree, buildTree2 } from './../../helpers/tree';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_PROMOTION_CODE_ROUTE } from 'config/api-consts';
import { PromotionCode } from 'models/PromotionCode';
import { PromotionCodeFilter } from 'models/PromotionCodeFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { PromotionDiscountType } from 'models/PromotionDiscountType';
import { PromotionDiscountTypeFilter } from 'models/PromotionDiscountTypeFilter';
import { PromotionProductAppliedType } from 'models/PromotionProductAppliedType';
import { PromotionType } from 'models/PromotionType';
import { PromotionTypeFilter } from 'models/PromotionTypeFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { PromotionCodeHistory } from 'models/PromotionCodeHistory';
import { PromotionCodeHistoryFilter } from 'models/PromotionCodeHistoryFilter';
import { PromotionCodeProductMapping } from 'models/PromotionCodeProductMapping';
import { PromotionCodeProductMappingFilter } from 'models/PromotionCodeProductMappingFilter';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { PromotionProductAppliedTypeFilter } from 'models/PromotionProductAppliedTypeFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreType } from 'models/StoreType';
import { StoreGrouping } from 'models/StoreGrouping';
import { Supplier } from 'models/Supplier';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
export class PromotionCodeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PROMOTION_CODE_ROUTE));
  }

  public count = (
    promotionCodeFilter?: PromotionCodeFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), promotionCodeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    promotionCodeFilter?: PromotionCodeFilter,
  ): Promise<PromotionCode[]> => {
    return this.http
      .post<PromotionCode[]>(kebabCase(nameof(this.list)), promotionCodeFilter)
      .then((response: AxiosResponse<PromotionCode[]>) => {
        return response.data?.map(
          (promotionCode: PureModelData<PromotionCode>) =>
            PromotionCode.clone<PromotionCode>(promotionCode),
        );
      });
  };

  public get = (id: number | string): Promise<PromotionCode> => {
    return this.http
      .post<PromotionCode>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<PromotionCode>) =>
        PromotionCode.clone<PromotionCode>(response.data),
      );
  };

  public create = (promotionCode: PromotionCode): Promise<PromotionCode> => {
    return this.http
      .post<PromotionCode>(kebabCase(nameof(this.create)), promotionCode)
      .then((response: AxiosResponse<PureModelData<PromotionCode>>) =>
        PromotionCode.clone<PromotionCode>(response.data),
      );
  };

  public update = (promotionCode: PromotionCode): Promise<PromotionCode> => {
    return this.http
      .post<PromotionCode>(kebabCase(nameof(this.update)), promotionCode)
      .then((response: AxiosResponse<PromotionCode>) =>
        PromotionCode.clone<PromotionCode>(response.data),
      );
  };

  public delete = (promotionCode: PromotionCode): Promise<PromotionCode> => {
    return this.http
      .post<PromotionCode>(kebabCase(nameof(this.delete)), promotionCode)
      .then((response: AxiosResponse<PromotionCode>) =>
        PromotionCode.clone<PromotionCode>(response.data),
      );
  };

  public save = (promotionCode: PromotionCode): Promise<PromotionCode> => {
    return promotionCode.id
      ? this.update(promotionCode)
      : this.create(promotionCode);
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

  public singleListOrganization2 = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree2(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };

  public singleListOrganization3 = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return response.data.map((organization: PureModelData<Organization>) =>
          Organization.clone<Organization>(organization),
        );
      });
  };
  public singleListPromotionDiscountType = (): Promise<
    PromotionDiscountType[]
  > => {
    return this.http
      .post<PromotionDiscountType[]>(
        kebabCase(nameof(this.singleListPromotionDiscountType)),
        new PromotionDiscountTypeFilter(),
      )
      .then((response: AxiosResponse<PromotionDiscountType[]>) => {
        return response.data.map(
          (promotionDiscountType: PureModelData<PromotionDiscountType>) =>
            PromotionDiscountType.clone<PromotionDiscountType>(
              promotionDiscountType,
            ),
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

  public filterListPromotionDiscountType = (): Promise<
    PromotionDiscountType[]
  > => {
    return this.http
      .post<PromotionDiscountType[]>(
        kebabCase(nameof(this.filterListPromotionDiscountType)),
        new PromotionDiscountTypeFilter(),
      )
      .then((response: AxiosResponse<PromotionDiscountType[]>) => {
        return response.data.map(
          (promotionDiscountType: PureModelData<PromotionDiscountType>) =>
            PromotionDiscountType.clone<PromotionDiscountType>(
              promotionDiscountType,
            ),
        );
      });
  };
  public filterListStore = (): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.filterListStore)), new StoreFilter())
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public singleListPromotionProductAppliedType = (): Promise<
    PromotionProductAppliedType[]
  > => {
    return this.http
      .post<PromotionProductAppliedType[]>(
        kebabCase(nameof(this.singleListPromotionProductAppliedType)),
        new PromotionProductAppliedTypeFilter(),
      )
      .then((response: AxiosResponse<PromotionProductAppliedType[]>) => {
        return response.data.map(
          (promotionType: PureModelData<PromotionProductAppliedType>) =>
            PromotionType.clone<PromotionProductAppliedType>(promotionType),
        );
      });
  };
  public singleListPromotionType = (): Promise<PromotionType[]> => {
    return this.http
      .post<PromotionType[]>(
        kebabCase(nameof(this.singleListPromotionType)),
        new PromotionTypeFilter(),
      )
      .then((response: AxiosResponse<PromotionType[]>) => {
        return response.data.map(
          (promotionType: PureModelData<PromotionType>) =>
            PromotionType.clone<PromotionType>(promotionType),
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
  public singleListPromotionCodeHistory = (
    promotionCodeHistoryFilter: PromotionCodeHistoryFilter,
  ): Promise<PromotionCodeHistory[]> => {
    return this.http
      .post<PromotionCodeHistory[]>(
        kebabCase(nameof(this.singleListPromotionCodeHistory)),
        promotionCodeHistoryFilter,
      )
      .then((response: AxiosResponse<PromotionCodeHistory[]>) => {
        return response.data.map(
          (promotionCodeHistory: PureModelData<PromotionCodeHistory>) =>
            PromotionCodeHistory.clone<PromotionCodeHistory>(
              promotionCodeHistory,
            ),
        );
      });
  };
  public singleListPromotionCodeProductMapping = (
    promotionCodeProductMappingFilter: PromotionCodeProductMappingFilter,
  ): Promise<PromotionCodeProductMapping[]> => {
    return this.http
      .post<PromotionCodeProductMapping[]>(
        kebabCase(nameof(this.singleListPromotionCodeProductMapping)),
        promotionCodeProductMappingFilter,
      )
      .then((response: AxiosResponse<PromotionCodeProductMapping[]>) => {
        return response.data.map(
          (
            promotionCodeProductMapping: PureModelData<
              PromotionCodeProductMapping
            >,
          ) =>
            PromotionCodeProductMapping.clone<PromotionCodeProductMapping>(
              promotionCodeProductMapping,
            ),
        );
      });
  };
  public singleListProduct = (
    productFilter: ProductFilter,
  ): Promise<Product[]> => {
    return this.http
      .post<Product[]>(kebabCase(nameof(this.singleListProduct)), productFilter)
      .then((response: AxiosResponse<Product[]>) => {
        return response.data.map((product: PureModelData<Product>) =>
          Product.clone<Product>(product),
        );
      });
  };

  public countProduct = (productFilter: ProductFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countProduct)), productFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listProduct = (productFilter: ProductFilter): Promise<Product[]> => {
    return this.http
      .post<Product[]>(kebabCase(nameof(this.listProduct)), productFilter)
      .then((response: AxiosResponse<Product[]>) => {
        return response.data.map((product: PureModelData<Product>) =>
          Product.clone<Product>(product),
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

  public countStore = (storeFilter: StoreFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
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
  public singleListSupplier = (
    supplierFilter: SupplierFilter,
  ): Promise<Supplier[]> => {
    return this.http
      .post<Supplier[]>(
        kebabCase(nameof(this.singleListSupplier)),
        supplierFilter,
      )
      .then((response: AxiosResponse<Supplier[]>) => {
        return response.data.map((supplier: PureModelData<Supplier>) =>
          Supplier.clone<Supplier>(supplier),
        );
      });
  };
  public singleListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.singleListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };
}

export const promotionCodeRepository: PromotionCode = new PromotionCodeRepository();
