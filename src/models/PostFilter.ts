import { IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';
export class PostFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public content?: StringFilter = new StringFilter();
  public url?: StringFilter = new StringFilter();
  public discussionId?: StringFilter = new StringFilter();
  public creatorId?: IdFilter = new IdFilter();
//   public createdAt?: DateFilter = new DateFilter();
//   public upatedAt?: DateFilter = new DateFilter();
}
