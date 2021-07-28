import { IdFilter, StringFilter, DateFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class BannerFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public title?: StringFilter = new StringFilter();
  public priority?: StringFilter = new StringFilter();
  public content?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public organizationId?: IdFilter = new IdFilter();
}
