import { Model } from 'core/models';
import { Image } from './Image';
import { Store } from './Store';
import { Album } from './Album';
import { Moment } from 'moment';
import { AppUser } from './AppUser';

export class StoreImageMapping extends Model {
  public storeId?: number;
  public imageId?: number;
  public albumId?: number;
  public ShootingAt?: Moment;
  public album?: Album;
  public image?: Image;
  public store?: Store;
  public distance?: number;
  public saleEmployee?: AppUser;
}
