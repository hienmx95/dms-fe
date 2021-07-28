import { Model } from 'core/models';
import { Moment } from 'moment';

export class StoreGeneralReportDataTable extends Model{
    public organizationName?: string;
    public checkingPlannedCounter?: number;
    public checkingUnPlannedCounter?: number;
    public totalCheckingTime?: string;
    public firstChecking?: Moment;
    public lastChecking?: Moment;
    public indirectSalesOrderCounter?: number;
    public skuCounter?: number;
    public totalRevenue?: number;
    public lastOrder?: Moment;
    public lastOrderDisplay?: string;
    public rowSpan?: number = 1;
    public employeeLastChecking?: string;
    public eFirstChecking?: string;
    public eLastChecking?: string;
    public storeStatusName?: string;

}