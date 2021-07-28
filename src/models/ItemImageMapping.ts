import { Model } from 'core/models';
import { Image } from './Image';

export class ItemImageMapping extends Model {
  public itemId?: number;
  public imageId?: number;
  public image?: Image;
}
