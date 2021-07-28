import { Model } from 'core/models';
import { Store } from './Store';
export class AppUserStoreMapping extends Model {
    public appUserId?: number;
    public storeId?: number;
    public store?: Store;
  }
