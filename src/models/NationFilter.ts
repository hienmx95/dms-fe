import { StringFilter, IdFilter, NumberFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class NationFilter extends ModelFilter {
    public id?: IdFilter = new IdFilter();
    public code?: StringFilter = new StringFilter();
    public name?: StringFilter = new StringFilter();
    public statusId?: IdFilter = new IdFilter();
    public displayOrder?: NumberFilter = new NumberFilter();
    public updatedAt?: DateFilter = new DateFilter();
}
