import { Item } from './../Item';
import { Model } from 'core/models';
import { KpiItem } from './KpiItem';

export class KpiItemContent extends Model
{
    public id?: number;
    public kpiItemId?: number;
    public itemId?: number;
    public item?: Item;
    public kpiItem?: KpiItem;
    public kpiItemContentKpiCriteriaItemMappings?: Record<string, number>;
    public indirectQuantity?: number ;
    public indirectRevenue?: number;
    public indirectAmount?: number ;
    public indirectStore?: number;
    public directQuantity?: number ;
    public directRevenue?: number ;
    public directAmount?: number ;
    public directStore?: number ;
}
