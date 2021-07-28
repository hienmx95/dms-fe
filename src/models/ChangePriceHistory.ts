import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from './AppUser';

export class ChangePriceHistory extends Model {
    public id?: number;

    public itemId?: number;

    public time?: Moment;

    public updateTime?: Moment;

    public oldPrice?: number;

    public newPrice?: number;

    public accountingStock?: number;

    public modifierId?: number;

    public modifier?: AppUser;
}
