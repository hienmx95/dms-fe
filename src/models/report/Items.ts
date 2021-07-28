import { Model } from 'core/models';

export class Items extends Model{
    public id?: number;
    public code?: string;
    public name?: string;
    public unitOfMeaureName?: string;
    public saleStock?: number;
    public promotionStock?: number;
    public salePriceAverage?: number;
    public discount?: number;
    public revenue?: number;
    public indirectSalesOrderCounter?: number;
    public buyerStoreCounter?: number;
}