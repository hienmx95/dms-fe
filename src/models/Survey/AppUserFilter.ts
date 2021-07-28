import { ModelFilter } from 'core/models';
import { StringFilter } from 'core/filters';

export class AppUserFilter extends ModelFilter {
  public displayName?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
}
