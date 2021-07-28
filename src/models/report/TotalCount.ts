import { Model } from 'core/models';
export class TotalCount extends Model{
    public totalSalesStock?: number;
    public totalPromotionStock?: number;
    public totalDiscount?: number;
    public totalRevenue?: number;
}