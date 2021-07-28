import { RequestState } from './../RequestState';
import { Model, ModelFilter } from 'core/models';
import { Moment } from 'moment';
import { Organization } from 'models/Organization';
import { Item } from 'models/Item';
import { IdFilter, StringFilter, NumberFilter, DateFilter } from 'core/filters';
import { StoreGrouping } from 'models/StoreGrouping';
import { StoreType } from 'models/StoreType';
import { Store } from 'models/Store';
import { Province } from 'models/Province';
import { ProductGrouping } from 'models/ProductGrouping';
import { AppUser } from 'models/AppUser';

export class PriceList extends Model {
  id?: number;
  code?: string;
  name?: string;
  startDate?: Moment;
  endDate?: Moment;
  updatedAt?: Moment;
  statusId?: number = 1;
  status?: PriceListStatus;
  organizationId?: number;
  organzation?: Organization;
  priceListTypeId?: number;
  priceListType?: PriceListType;
  salesOrderTypeId?: number;
  salesOrderType?: SalesOrderType;
  priceListItemMappings?: PriceListItemMappings[];
  priceListStoreMappings?: PriceListStoreMappings[];
  priceListStoreTypeMappings?: PriceListStoreTypeMappings[];
  priceListStoreGroupingMappings?: PriceListStoreGroupingMappings[];
  requestState?: RequestState;
  requestStateId?: number;
}

export class PriceListStatus {
  id?: number;
  code?: string;
  name?: string;
}

export class PriceListType extends Model {
  id?: number;
  code?: string;
  name?: string;
}

export class PriceListTypeFilter extends ModelFilter {
  id?: IdFilter = new IdFilter();
  code?: StringFilter = new StringFilter();
  name?: StringFilter = new StringFilter();
}

export class SalesOrderType extends Model {
  id?: number;
  code?: string;
  name?: string;
}

export class SalesOrderTypeFilter extends ModelFilter {
  id?: IdFilter = new IdFilter();
  code?: StringFilter = new StringFilter();
  name?: StringFilter = new StringFilter();
}

export class PriceListItemMappings extends Model {
  priceListId?: number;
  itemId?: number;
  price?: number;
  item?: Item;
  itemCode?: string;
  itemName?: string;
  itemScanCode?: string;
  productGroupings?: ProductGrouping[];
}

export class PriceListItemMappingsFilter extends ModelFilter {
  itemCode?: StringFilter = new StringFilter();
  itemName?: StringFilter = new StringFilter();
  itemScanCode?: StringFilter = new StringFilter();
}

export class PriceListStoreGroupingMappings extends Model {
  priceListId?: number;
  storeGroupingId: number;
  storeGrouping: StoreGrouping;
}

export class PriceListStoreMappings extends Model {
  priceListId?: number;
  storeId?: number;
  store?: Store;
  storeCode?: string;
  storeName?: string;
  storeTypeId?: number;
  storeGroupingId?: number;
  provinceId?: number;
  storeType: StoreType;
  storeGrouping: StoreGrouping;
  province: Province;
}

export class PriceListStoreMappingsFilter extends ModelFilter {
  storeCode?: StringFilter = new StringFilter();

  storeCodeDraft?: StringFilter = new StringFilter();
  storeName?: StringFilter = new StringFilter();
  storeTypeId?: IdFilter = new IdFilter();
  storeGroupingId?: IdFilter = new IdFilter();
  provinceId?: IdFilter = new IdFilter();
}

export class PriceListStoreTypeMappings extends Model {
  priceListId?: number;
  storeTypeId?: number;
  storeType?: StoreType;
}

export class PriceListItemHistory extends Model {
  id?: number;
  priceListId?: number;
  itemId?: number;
  modifierId?: number;
  oldPrice?: number;
  newPrice?: number;
  updateAt?: Moment;
  source?: string;
  modifier?: AppUser;
}

export class PriceListItemHistoryFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  priceListId: IdFilter = new IdFilter();
  itemId: IdFilter = new IdFilter();
  modifierId: IdFilter = new IdFilter();
  oldPrice: NumberFilter = new NumberFilter();
  newPrice: NumberFilter = new NumberFilter();
  updatedAt: DateFilter = new DateFilter();
  source: StringFilter = new StringFilter();
}
