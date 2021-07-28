import { Model } from 'core/models';

export class StoreUnCheckedReportDataTable extends Model{
    public organizationName?: string;
    public saleEmployeeId?: string;
    public username?: string;
    public displayName?: string;
    public date?: string;
    public eRouteCode?: string;
    public storeCode?: string;
    public storeName?: string;
    public storeAddress?: string;
    public storeTypeName?: string;
    public storePhone?: string;
    public title?: string;
    public storeStatusName?: string;
    public rowSpan?: number = 1;
}