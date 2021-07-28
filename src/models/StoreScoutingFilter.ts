import { StringFilter, DateFilter  } from 'core/filters';
import { IdFilter  } from 'core/filters';
import { NumberFilter  } from 'core/filters';
import { ModelFilter } from 'core/models';

export class StoreScoutingFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public ownerPhone?: StringFilter = new StringFilter();
  public provinceId?: IdFilter = new IdFilter();
  public districtId?: IdFilter = new IdFilter();
  public wardId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public address?: StringFilter = new StringFilter();
  public latitude?: NumberFilter = new NumberFilter();
  public longitude?: NumberFilter = new NumberFilter();
  public appUserId?: IdFilter = new IdFilter();
  public storeScoutingStatusId?: IdFilter = new IdFilter();
  public createdAt?: DateFilter = new DateFilter();

  public storeScoutingTypeId?: IdFilter = new IdFilter();
}
