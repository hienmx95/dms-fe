import { Model } from 'core/models';

export class DirectSalesOrderByStoreAndItemsReportDataTable extends Model{
    public organizationName?: string;
    public rowSpan?: number = 0;
    public title?: string;
    public salesOrder?: string;
    public storeId?: string;
    public storeCode?: string;
    public storeName?: string;
    public address?: string;
    public itemId?: string;
    public itemCode?: string;
    public itemName?: string;
    public unitOfMeasureName?: string;
    public saleStock?: number;
    public promotionStock?: number;
    public salePriceAverage?: number;
    public discount?: number;
    public revenue?: number;
    public directSalesOrderCounter?: number;
    public totalSalesStock?: number;
    public totalPromotionStock?: number;
    public totalDiscount?: number;
    public totalRevenue?: number;
    public isTotal?: boolean = false;
}