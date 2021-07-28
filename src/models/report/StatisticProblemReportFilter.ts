import { ModelFilter } from 'core/models';
import { IdFilter, DateFilter } from 'core/filters';

export class StatisticProblemReportFilter extends ModelFilter{
    public organizationId ?: IdFilter = new IdFilter();

    public storeId?: IdFilter = new IdFilter();

    public storeTypeId?: IdFilter = new IdFilter();
    public storeGroupingId?: IdFilter = new IdFilter();
    public date?: DateFilter = new DateFilter();

    public storeStatusId?: IdFilter = new IdFilter();
}