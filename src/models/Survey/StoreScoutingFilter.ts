import { ModelFilter } from 'core/models';
import { StringFilter, IdFilter } from 'core/filters';

export class StoreScoutingFilter extends ModelFilter {
  public storeScoutingCode?: StringFilter = new StringFilter();
  public storeScoutingName?: StringFilter = new StringFilter();
  public organizationName?: StringFilter = new StringFilter();

  public organizationId?: IdFilter = new IdFilter();
}
