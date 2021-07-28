import { StoreChecking } from 'models/monitor/StoreChecking';
import { AppUser } from 'models/AppUser';
import { RequestState } from 'models/RequestState';
import { Status } from 'models/Status';
import { Store } from 'models/Store';
import { Model } from 'core/models';
import { Moment } from 'moment';
import { Organization } from 'models/Organization';

export class DirectSalesOrder extends Model {
  public id?: number;

  public code?: string;

  public organizationId?: number;

  public buyerStoreId?: number;

  public phoneNumber?: string;

  public storeAddress?: string;

  public deliveryAddress?: string;

  public saleEmployeeId?: number;

  public orderDate?: Moment;

  public deliveryDate?: Moment;

  public requestStateId?: number;

  public editedPriceStatusId?: number;

  public note?: string;

  public subTotal?: number;

  public generalDiscountPercentage?: number;

  public generalDiscountAmount?: number;

  public totalTaxAmount?: number;

  public total?: number;

  public storeCheckingId?: number;

  public buyerStore?: Store;

  public editedPriceStatus?: Status;

  public organization?: Organization;

  public requestState?: RequestState;

  public saleEmployee?: AppUser;

  public storeChecking?: StoreChecking;

  public totalAfterTax?: number;

  public promotionCode?: string;

  public promotionValue?: number;
}
