import { DateFilter, IdFilter, StringFilter } from 'core/filters';
import { Model, ModelFilter } from 'core/models';
import { StoreImageMapping } from 'models/monitor/StoreImageMapping';
import { Moment } from 'moment';
import { Store } from 'models/Store';
import { Image } from 'models/Image';
import { Album } from 'models/Album';

export class AlbumnMonitor extends Model {
  public storeCheckingImageMappings: StoreImageMapping[];
}

export class AlbumnMonitorFilter extends ModelFilter {
  public albumId?: IdFilter = new IdFilter();
  public organizationId?: IdFilter = new IdFilter();
  public appUserId?: IdFilter = new IdFilter();
  public storeId?: StringFilter = new StringFilter();
  public checkIn?: DateFilter = new DateFilter();
}
export class AlbumTableData extends Model {
  public imageId?: number;
  public distance?: number;
  public albumId?: number;
  public storeId?: number;
  public shootingAt?: Moment;
  public store?: Store;
  public image?: Image;
  public albumn?: Album;
  public imageName?: string;
  public creatorName?: string;
}
