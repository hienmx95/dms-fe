import { Model } from 'core/models';

export class SalesOrderByEmployeeAndItemReportDataTable extends Model{
    public organizationName?: string;
    public saleEmployeeId?: string;
    public username?: string;
    public displayName?: string;
    public codeItem?: string;
    public nameItem?: string;
    public unitOfMeasureName?: string;
     public saleStock?: number;
     public promotionStock?:number;
     public salePriceAverage?: number;
     public discount?: number;
     public revenue?: number;
     public indirectSalesOrderCounter?: number;
     public buyerStoreCounter?: number;
     public store?: string;
    public rowSpan?: number = 0;
}