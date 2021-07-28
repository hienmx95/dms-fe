import { Model } from 'core/models';
import { Item } from './Item';
import { Warehouse } from './Warehouse';

export class Inventory extends Model {
  public id?: number;

  public warehouseId?: number;

  public itemId?: number;

  public saleStock?: number;

  public accountingStock?: number;

  public item?: Item;

  public warehouse?: Warehouse;
}
