import { Model } from 'core/models';
import { KpiGeneralContent } from './KpiGeneralContent';
import { KpiPeriod } from './KpiPeriod';

export class KpiGeneralContentKpiPeriodMapping extends Model
{
    public kpiGeneralContentId?: number;

    public kpiPeriodId?: number;

    public value?: number;


    public kpiGeneralContent?: KpiGeneralContent;

    public kpiPeriod?: KpiPeriod;
}
