import { IdFilter, StringFilter } from 'core/filters';
import { DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class AppUserFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public username?: StringFilter = new StringFilter();
  public password?: StringFilter = new StringFilter();
  public displayName?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public position?: StringFilter = new StringFilter();
  public department?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
  public sexId?: IdFilter = new IdFilter();
  public statusId?: IdFilter = new IdFilter();
  public avatar?: StringFilter = new StringFilter();
  public birthday?: DateFilter = new DateFilter();
  public rowId?: IdFilter = new IdFilter();
  public kpiPeriodId?: IdFilter = new IdFilter();

  public kpiYearId?: IdFilter = new IdFilter();
  public kpiItemTypeId?: IdFilter = new IdFilter();
  public kpiProductGroupingTypeId?: IdFilter = new IdFilter();
}
