import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { buildTree } from 'helpers/tree';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_DIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { RequestStateStatus } from 'models/RequestStateStatus';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { EditPriceStatus } from 'models/EditPriceStatus';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreType } from 'models/StoreType';
import { ProductType } from 'models/ProductType';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Organization } from 'models/Organization';
import { DirectSalesOrder } from 'models/Direct/DirectSalesOrder';
import { DirectSalesOrderFilter } from 'models/Direct/DirectSalesOrderFilter';
import { DirectSalesOrderContentFilter } from 'models/Direct/DirectSalesOrderContentFilter';
import { DirectSalesOrderContent } from 'models/Direct/DirectSalesOrderContent';
import { DirectSalesOrderPromotionFilter } from 'models/Direct/DirectSalesOrderPromotionFilter';
import { DirectSalesOrderPromotion } from 'models/Direct/DirectSalesOrderPromotion';
import { TaxType } from 'models/TaxType';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';

export class DirectSalesOrderRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_DIRECT_SALES_ORDER_ROUTE));
  }

  public count = (
    directSalesOrderFilter?: DirectSalesOrderFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), directSalesOrderFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    directSalesOrderFilter?: DirectSalesOrderFilter,
  ): Promise<DirectSalesOrder[]> => {
    return this.http
      .post<DirectSalesOrder[]>(
        kebabCase(nameof(this.list)),
        directSalesOrderFilter,
      )
      .then((response: AxiosResponse<DirectSalesOrder[]>) => {
        return response.data?.map(
          (directSalesOrder: PureModelData<DirectSalesOrder>) =>
            DirectSalesOrder.clone<DirectSalesOrder>(directSalesOrder),
        );
      });
  };

  public countBuyerStore = (storeFilter?: StoreFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countBuyerStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listBuyerStore = (storeFilter?: StoreFilter): Promise<Store[]> => {
    return this.http
      .post<Store[]>(kebabCase(nameof(this.listBuyerStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data?.map((store: PureModelData<Store>) =>
          Store.clone<Store>(store),
        );
      });
  };

  public countItem = (itemFilter?: ItemFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countItem)), itemFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listItem = (itemFilter?: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.listItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data?.map((item: PureModelData<Item>) =>
          Item.clone<Item>(item),
        );
      });
  };

  public get = (id: number | string): Promise<DirectSalesOrder> => {
    return this.http
      .post<DirectSalesOrder>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<DirectSalesOrder>) =>
        DirectSalesOrder.clone<DirectSalesOrder>(response.data),
      );
  };

  public create = (
    directSalesOrder: DirectSalesOrder,
  ): Promise<DirectSalesOrder> => {
    return this.http
      .post<DirectSalesOrder>(kebabCase(nameof(this.create)), directSalesOrder)
      .then((response: AxiosResponse<PureModelData<DirectSalesOrder>>) =>
        DirectSalesOrder.clone<DirectSalesOrder>(response.data),
      );
  };

  public update = (
    directSalesOrder: DirectSalesOrder,
  ): Promise<DirectSalesOrder> => {
    return this.http
      .post<DirectSalesOrder>(kebabCase(nameof(this.update)), directSalesOrder)
      .then((response: AxiosResponse<DirectSalesOrder>) =>
        DirectSalesOrder.clone<DirectSalesOrder>(response.data),
      );
  };

  public delete = (
    directSalesOrder: DirectSalesOrder,
  ): Promise<DirectSalesOrder> => {
    return this.http
      .post<DirectSalesOrder>(kebabCase(nameof(this.delete)), directSalesOrder)
      .then((response: AxiosResponse<DirectSalesOrder>) =>
        DirectSalesOrder.clone<DirectSalesOrder>(response.data),
      );
  };

  public save = (
    directSalesOrder: DirectSalesOrder,
  ): Promise<DirectSalesOrder> => {
    return directSalesOrder.id
      ? this.update(directSalesOrder)
      : this.create(directSalesOrder);
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
  public singleListRequestState = (): Promise<RequestStateStatus[]> => {
    return this.http
      .post<RequestStateStatus[]>(
        kebabCase(nameof(this.singleListRequestState)),
        new RequestStateStatusFilter(),
      )
      .then((response: AxiosResponse<RequestStateStatus[]>) => {
        return response.data.map(
          (requestStateStatus: PureModelData<RequestStateStatus>) =>
            RequestStateStatus.clone<RequestStateStatus>(requestStateStatus),
        );
      });
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

  public singleListEditPriceStatus = (): Promise<EditPriceStatus[]> => {
    return this.http
      .post<EditPriceStatus[]>(
        kebabCase(nameof(this.singleListEditPriceStatus)),
        new EditPriceStatusFilter(),
      )
      .then((response: AxiosResponse<EditPriceStatus[]>) => {
        return response.data.map((status: PureModelData<EditPriceStatus>) =>
          EditPriceStatus.clone<EditPriceStatus>(status),
        );
      });
  };
  public filterListEditPriceStatus = (): Promise<EditPriceStatus[]> => {
    return this.http
      .post<EditPriceStatus[]>(
        kebabCase(nameof(this.filterListEditPriceStatus)),
        new EditPriceStatusFilter(),
      )
      .then((response: AxiosResponse<EditPriceStatus[]>) => {
        return response.data.map((status: PureModelData<EditPriceStatus>) =>
          EditPriceStatus.clone<EditPriceStatus>(status),
        );
      });
  };

  public filterListDirectSalesOrderContent = (
    directSalesOrderContentFilter: DirectSalesOrderContentFilter,
  ): Promise<DirectSalesOrderContent[]> => {
    return this.http
      .post<DirectSalesOrderContent[]>(
        kebabCase(nameof(this.filterListDirectSalesOrderContent)),
        directSalesOrderContentFilter,
      )
      .then((response: AxiosResponse<DirectSalesOrderContent[]>) => {
        return response.data.map(
          (directSalesOrderContent: PureModelData<DirectSalesOrderContent>) =>
            DirectSalesOrderContent.clone<DirectSalesOrderContent>(
              directSalesOrderContent,
            ),
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

  public singleListDirectSalesOrderPromotion = (
    directSalesOrderPromotionFilter: DirectSalesOrderPromotionFilter,
  ): Promise<DirectSalesOrderPromotion[]> => {
    return this.http
      .post<DirectSalesOrderPromotion[]>(
        kebabCase(nameof(this.singleListDirectSalesOrderPromotion)),
        directSalesOrderPromotionFilter,
      )
      .then((response: AxiosResponse<DirectSalesOrderPromotion[]>) => {
        return response.data.map(
          (
            directSalesOrderPromotion: PureModelData<DirectSalesOrderPromotion>,
          ) =>
            DirectSalesOrderPromotion.clone<DirectSalesOrderPromotion>(
              directSalesOrderPromotion,
            ),
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

  public singleListStoreGrouping = (
    storeGroupingFilter: StoreGroupingFilter,
  ): Promise<StoreGrouping[]> => {
    return this.http
      .post<StoreGrouping[]>(
        kebabCase(nameof(this.singleListStoreGrouping)),
        storeGroupingFilter,
      )
      .then((response: AxiosResponse<StoreGrouping[]>) => {
        return response.data.map(
          (storeGrouping: PureModelData<StoreGrouping>) =>
            StoreGrouping.clone<StoreGrouping>(storeGrouping),
        );
      });
  };

  public singleListStoreType = (
    storeTypeFilter: StoreTypeFilter,
  ): Promise<StoreType[]> => {
    return this.http
      .post<StoreType[]>(
        kebabCase(nameof(this.singleListStoreType)),
        storeTypeFilter,
      )
      .then((response: AxiosResponse<StoreType[]>) => {
        return response.data.map((storeType: PureModelData<StoreType>) =>
          StoreType.clone<StoreType>(storeType),
        );
      });
  };

  public singleListProductType = (
    productTypeFilter: ProductTypeFilter,
  ): Promise<ProductType[]> => {
    return this.http
      .post<ProductType[]>(
        kebabCase(nameof(this.singleListProductType)),
        productTypeFilter,
      )
      .then((response: AxiosResponse<ProductType[]>) => {
        return response.data.map((productType: PureModelData<ProductType>) =>
          ProductType.clone<ProductType>(productType),
        );
      });
  };

  public singleListProductGrouping = (
    productGroupingFilter: ProductGroupingFilter,
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

  public singleListTaxType = (
    taxTypeFilter: TaxTypeFilter,
  ): Promise<TaxType[]> => {
    return this.http
      .post<TaxType[]>(kebabCase(nameof(this.singleListTaxType)), taxTypeFilter)
      .then((response: AxiosResponse<TaxType[]>) => {
        return response.data.map((taxType: PureModelData<TaxType>) =>
          TaxType.clone<TaxType>(taxType),
        );
      });
  };

  public getDetail = (id: number | string): Promise<DirectSalesOrder> => {
    return this.http
      .post<DirectSalesOrder>(kebabCase(nameof(this.getDetail)), {
        id,
      })
      .then((response: AxiosResponse<DirectSalesOrder>) =>
        DirectSalesOrder.clone<DirectSalesOrder>(response.data),
      );
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

  public filterListStoreStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStoreStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };

  public export = (
    directSalesOrderFilter?: DirectSalesOrderFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', directSalesOrderFilter, {
      responseType: 'arraybuffer',
    });
  };

  public filterListBrand = (brandFilter: BrandFilter): Promise<Brand[]> => {
    return this.http
      .post<Brand[]>(kebabCase(nameof(this.filterListBrand)), brandFilter)
      .then((response: AxiosResponse<Brand[]>) => {
        return response.data.map((brand: PureModelData<Brand>) =>
          Brand.clone<Brand>(brand),
        );
      });
  };
}

export const directSalesOrderRepository: DirectSalesOrder = new DirectSalesOrderRepository();
