import { Model } from 'core/models';
import { AppUser } from 'models/AppUser';
import { ShowingItem } from './ShowingItem';
import { ShowingWarehouse } from './ShowingWarehouse';

export class ShowingInventory extends Model {
  public id?: number;

  public showingWarehouseId?: number;

  public showingItemId?: number;

  public saleStock?: number;

  public accountingStock?: number;

  public appUserId?: number;

  public appUser?: AppUser;

  public showingItem?: ShowingItem;

  public showingWarehouse?: ShowingWarehouse;
}
