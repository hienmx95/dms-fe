import { Model } from 'core/models';
import { AppUser } from 'models/AppUser';
import { ShowingInventory } from './ShowingInventory';

export class ShowingInventoryHistory extends Model {
  public id?: number;

  public showingInventoryId?: number;

  public oldSaleStock?: number;

  public saleStock?: number;

  public oldAccountingStock?: number;

  public accountingStock?: number;

  public appUserId?: number;

  public appUser?: AppUser;

  public showingInventory?: ShowingInventory;
}
