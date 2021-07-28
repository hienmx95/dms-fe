import { Model } from 'core/models';
import { KpiCriteriaTotal } from './KpiCriteriaTotal';
import { KpiItem } from './KpiItem';

export class KpiItemKpiCriteriaTotalMapping extends Model
{
    public kpiItemId?: number;

    public kpiCriteriaTotalId?: number;

    public value?: number;


    public kpiCriteriaTotal?: KpiCriteriaTotal;

    public kpiItem?: KpiItem;

}
