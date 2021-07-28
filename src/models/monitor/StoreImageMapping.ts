import { AppUser } from 'models/AppUser';
import { Image } from 'models/Image';
import { StoreChecking } from './StoreChecking';
import { Model } from 'core/models';
import { Store } from 'models/Store';

export class StoreImageMapping extends Model {
    public imageId: number;
    public storeId: number;
    public saleEmployeeId: number;
    public storeCheckingId: number;
    public albumId: number;
    public shootingAt: number;
    public saleEmployee: AppUser;
    public image: Image;
    public store: Store;
    public storeChecking: StoreChecking;
  }