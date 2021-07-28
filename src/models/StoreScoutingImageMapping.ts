import { Model } from 'core/models';
import { Image } from './Image';
import { StoreScouting } from './StoreScouting';

export class StoreScoutingImageMapping extends Model {
  public storeScoutingId?: number;
  public imageId?: number;
  public image?: Image;
  public storeScouting?: StoreScouting;
}
