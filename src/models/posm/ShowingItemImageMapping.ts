import { Model } from 'core/models';
import { Image } from 'models/Image';
import { ShowingItem } from './ShowingItem';

export class ShowingItemImageMapping extends Model {
  public showingItemId?: number;
  public showingItem?: ShowingItem;
  public imageId?: number;
  public image?: Image;
}
