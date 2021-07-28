import { Store } from 'models/Store';
import { Model } from 'core/models/Model';
export class SalesOrderGeneralReport extends Model {
  organizationName: string;
  buyerStore: Store;

  sellerStore: Store;
}
