import { DateFilter, IdFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';
export class CommentFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public content?: StringFilter = new StringFilter();
  public postId?: IdFilter = new IdFilter();
  public creatorId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();
  public upatedAt?: DateFilter = new DateFilter();
}
