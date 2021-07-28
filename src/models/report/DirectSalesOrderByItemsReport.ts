import { Model } from 'core/models';

export class DirectSalesOrderByItemsReport extends Model{
    public itemId?: number;
    public itemCode?: string;
    public itemName?: string;
    public unitOfMeaureName?: string;
    public saleStock?: number;
    public promotionStock?: number;
    public discount?: number;
    public revenue?: number;
    public indirecSalesOrderCounter?: number;
    public buyerStoreCounter?: number;
    public totalSalesStock?: number;
    public totalPromotionStock?: number;
    public totalDiscount?: number;
    public totalRevenue?: number;
}