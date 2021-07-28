import { Organization } from './Organization';
import { Model } from 'core/models';
import { Moment } from 'moment';
import { RequestStateStatus } from './RequestStateStatus';
import { AppUser } from './AppUser';
import { Store } from './Store';
import { IndirectSalesOrderContent } from './IndirectSalesOrderContent';
import { IndirectSalesOrderPromotion } from './IndirectSalesOrderPromotion';
import { EditPriceStatus } from './EditPriceStatus';

export class IndirectSalesOrder extends Model {
  public id?: number;

  public code?: string;

  public buyerStoreId?: number;

  public phoneNumber?: string;

  public storeAddress?: string;

  public deliveryAddress?: string;

  public sellerStoreId?: number;

  public saleEmployeeId?: number;

  public orderDate?: Moment;

  public deliveryDate?: Moment;

  public indirectSalesOrderStatusId?: number;

  public isEditedPrice?: boolean;

  public note?: string;

  public subTotal?: number = 0;

  public generalDiscountPercentage?: number = 0;

  public generalDiscountAmount?: number;

  public totalTaxAmount?: number;

  public total?: number;

  public buyerStore?: Store;

  public saleEmployee?: AppUser;

  public sellerStore?: Store;

  public indirectSalesOrderContents?: IndirectSalesOrderContent[];

  public indirectSalesOrderPromotions?: IndirectSalesOrderPromotion[];

  public editedPriceStatus?: EditPriceStatus;

  public editedPriceStatusId?: number = 0;

  public requestStateId?: number;

  public requestState?: RequestStateStatus;

  public organization?: Organization;

  public organizationId?: number;
}
