import { Moment } from 'moment';
import { Model } from 'core/models';

export class SalesOrderGeneralReportDataTable extends Model {
  public organizationName?: string;
  public rowSpan?: number = 1;
  public title?: string;
  public salesOrder?: string;
  public discount?: number;
  public code?: string;
  public buyerStoreName?: string;
  public saleEmployeeName?: string;
  public sellerStoreName?: string;
  public taxValue?: number;
  public total?: number;
  public orderDate?: Moment;
  public subTotal?: number;
}
