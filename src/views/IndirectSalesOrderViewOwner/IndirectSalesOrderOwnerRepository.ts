import { StatusFilter } from 'models/StatusFilter';
import { AxiosResponse } from 'axios';
import { API_INDIRECT_SALES_ORDER_ROUTE, POST_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { buildTree } from 'helpers/tree';
import kebabCase from 'lodash/kebabCase';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { FileModel } from 'models/ChatBox/FileModel';
import { EditPriceStatus } from 'models/EditPriceStatus';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { IndirectSalesOrderContentFilter } from 'models/IndirectSalesOrderContentFilter';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { IndirectSalesOrderPromotion } from 'models/IndirectSalesOrderPromotion';
import { IndirectSalesOrderPromotionFilter } from 'models/IndirectSalesOrderPromotionFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Post } from 'models/Post';
import { PostFilter } from 'models/PostFilter';
import { ProductGrouping } from 'models/ProductGrouping';
import { ProductGroupingFilter } from 'models/ProductGroupingFilter';
import { ProductType } from 'models/ProductType';
import { ProductTypeFilter } from 'models/ProductTypeFilter';
import { RequestStateStatus } from 'models/RequestStateStatus';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { Status } from 'models/Status';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreGroupingFilter } from 'models/StoreGroupingFilter';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import { Supplier } from 'models/Supplier';
import { SupplierFilter } from 'models/SupplierFilter';
import { Brand } from 'models/Brand';
import { BrandFilter } from 'models/BrandFilter';
import { TaxType } from 'models/TaxType';
import { TaxTypeFilter } from 'models/TaxTypeFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { BatchId, PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { Category, CategoryFilter } from 'models/Category';

export class IndirectSalesOrderOwnerRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_INDIRECT_SALES_ORDER_ROUTE));
  }

  public count = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), indirectSalesOrderFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<IndirectSalesOrder[]> => {
    return this.http
      .post<IndirectSalesOrder[]>(
        kebabCase(nameof(this.list)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map(
          (indirectSalesOrder: PureModelData<IndirectSalesOrder>) =>
            IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder),
        );
      });
  };

  public countNew = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countNew)), indirectSalesOrderFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listNew = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<IndirectSalesOrder[]> => {
    return this.http
      .post<IndirectSalesOrder[]>(
        kebabCase(nameof(this.listNew)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map(
          (indirectSalesOrder: PureModelData<IndirectSalesOrder>) =>
            IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder),
        );
      });
  };

  public countPending = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countPending)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listPending = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<IndirectSalesOrder[]> => {
    return this.http
      .post<IndirectSalesOrder[]>(
        kebabCase(nameof(this.listPending)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map(
          (indirectSalesOrder: PureModelData<IndirectSalesOrder>) =>
            IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder),
        );
      });
  };

  public countCompleted = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<number> => {
    return this.http
      .post<number>(
        kebabCase(nameof(this.countCompleted)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listCompleted = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<IndirectSalesOrder[]> => {
    return this.http
      .post<IndirectSalesOrder[]>(
        kebabCase(nameof(this.listCompleted)),
        indirectSalesOrderFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map(
          (indirectSalesOrder: PureModelData<IndirectSalesOrder>) =>
            IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder),
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

  public get = (id: number | string): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public create = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.create)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<PureModelData<IndirectSalesOrder>>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public update = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.update)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public send = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.send)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public approve = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.approve)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public reject = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.reject)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public delete = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return this.http
      .post<IndirectSalesOrder>(
        kebabCase(nameof(this.delete)),
        indirectSalesOrder,
      )
      .then((response: AxiosResponse<IndirectSalesOrder>) =>
        IndirectSalesOrder.clone<IndirectSalesOrder>(response.data),
      );
  };

  public save = (
    indirectSalesOrder: IndirectSalesOrder,
  ): Promise<IndirectSalesOrder> => {
    return indirectSalesOrder.id
      ? this.update(indirectSalesOrder)
      : this.create(indirectSalesOrder);
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

  public filterListIndirectSalesOrderContent = (
    indirectSalesOrderContentFilter: IndirectSalesOrderContentFilter,
  ): Promise<IndirectSalesOrderContent[]> => {
    return this.http
      .post<IndirectSalesOrderContent[]>(
        kebabCase(nameof(this.filterListIndirectSalesOrderContent)),
        indirectSalesOrderContentFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrderContent[]>) => {
        return response.data.map(
          (
            indirectSalesOrderContent: PureModelData<IndirectSalesOrderContent>,
          ) =>
            IndirectSalesOrderContent.clone<IndirectSalesOrderContent>(
              indirectSalesOrderContent,
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

  public singleListIndirectSalesOrderPromotion = (
    indirectSalesOrderPromotionFilter: IndirectSalesOrderPromotionFilter,
  ): Promise<IndirectSalesOrderPromotion[]> => {
    return this.http
      .post<IndirectSalesOrderPromotion[]>(
        kebabCase(nameof(this.singleListIndirectSalesOrderPromotion)),
        indirectSalesOrderPromotionFilter,
      )
      .then((response: AxiosResponse<IndirectSalesOrderPromotion[]>) => {
        return response.data.map(
          (
            indirectSalesOrderPromotion: PureModelData<
              IndirectSalesOrderPromotion
            >,
          ) =>
            IndirectSalesOrderPromotion.clone<IndirectSalesOrderPromotion>(
              indirectSalesOrderPromotion,
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
  public bulkApprove = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkApprove)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public bulkReject = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkReject)), idList)
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
    return (
      this.http
        .post<Post>(kebabCase(nameof(this.saveFile)), formData, {
          baseURL: url(API_BASE_URL, POST_ROUTE),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params,
        })
        // .post(POST_ROUTE + '/save-file', formData, {
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        //   params,
        // })
        .then((response: AxiosResponse<FileModel>) => response.data)
    );
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
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', indirectSalesOrderFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportDetail = (
    indirectSalesOrderFilter?: IndirectSalesOrderFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-detail', indirectSalesOrderFilter, {
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

  public filterListCategory = (
    filter?: CategoryFilter,
  ): Promise<Category[]> => {
    return this.http
      .post<Category[]>(kebabCase(nameof(this.filterListCategory)), filter)
      .then((response: AxiosResponse<Category[]>) => {
        return buildTree(
          response.data.map((item: PureModelData<Category>) =>
            Category.clone<Category>(item),
          ),
        );
      });
  };
}

export const indirectSalesOrderOwnerRepository: IndirectSalesOrder = new IndirectSalesOrderOwnerRepository();
