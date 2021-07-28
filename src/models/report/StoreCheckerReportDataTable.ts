import { Model } from 'core/models';

export class StoreCheckerReportDataTable extends Model{
    public organizationName?: string;
    public saleEmployeeId?: string;
    public username?: string;
    public displayName?: string;
    public date?: string;
    public storeCode?: string;
    public storeName?: string;
    public storeAddress?: string;
    public checkIn?: string;
    public checkOut?: string;
    public duaration?: string;
    public checkInDistance?: string;
    public checkOutDistance?: string;
    public deviceName?: string;
    public imageCounter?: string;
    public planned?: string;
    public salesOrder?: string;
    public title?: string;
    public rowSpan?: number = 0;
  public storeStatusName?: string;

  public salesOrderCounter?: number = 0;

}
