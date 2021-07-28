import { Model } from 'core/models';
import { KpiCriteriaItem } from './KpiCriteriaItem';
import { KpiItemContent } from './KpiItemContent';

export class KpiItemContentKpiCriteriaItemMapping extends Model
{
    public kpiItemContentId?: number;

    public kpiCriteriaItemId?: number;

    public value?: number;


    public kpiCriteriaItem?: KpiCriteriaItem;

    public kpiItemContent?: KpiItemContent;
}
