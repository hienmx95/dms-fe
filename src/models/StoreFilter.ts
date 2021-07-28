import { IdFilter, NumberFilter, StringFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class StoreFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public code?: StringFilter = new StringFilter();
  public codeDraft?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
  public parentStoreId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public storeTypeId?: IdFilter = new IdFilter();
  public storeGroupingId?: IdFilter = new IdFilter();
  public telephone?: StringFilter = new StringFilter();
  public provinceId?: IdFilter = new IdFilter();
  public districtId?: IdFilter = new IdFilter();
  public wardId?: IdFilter = new IdFilter();
  public address?: StringFilter = new StringFilter();
  public deliveryAddress?: StringFilter = new StringFilter();
  public latitude?: NumberFilter = new NumberFilter();
  public longitude?: NumberFilter = new NumberFilter();
  public ownerName?: StringFilter = new StringFilter();
  public ownerPhone?: StringFilter = new StringFilter();
  public ownerEmail?: StringFilter = new StringFilter();
  public statusId?: IdFilter = new IdFilter();
  public saleEmployeeId?: IdFilter = new IdFilter();
  public storeStatusId?: IdFilter = new IdFilter();
  public storeUserStatusId?: IdFilter = new IdFilter();

  public resellerId?: IdFilter = new IdFilter();
  appUserId?: IdFilter = new IdFilter();
  creatorId?: IdFilter = new IdFilter();
}
