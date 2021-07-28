import { Model } from 'core/models';

export class DirectSalesOrderByItemsReportDataTable extends Model{
    public organizationName?: string;
    public rowSpan?: number = 1;
    public title?: string;
    public itemCode?: string;
    public itemName?: string;
    public unitOfMeasureName?: string;
    public saleStock?: number;
    public promotionStock?: number;
    public salePriceAverage?: number;
    public discount?: number;
    public revenue?: number;
    public indirecSalesOrderCounter?: number;
    public totalPromotionStock?: number;
    public total?: number;
}