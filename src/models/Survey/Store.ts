import { Model } from 'core/models';

export class Store extends Model {
  public id?: number;
  public storeCode?: string;
  public storeName?: string;
  public organizationName?: string;
  public organizationId?: number;
}
