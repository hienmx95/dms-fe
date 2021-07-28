import { Model } from 'core/models';
import { Organization } from './Organization';
import { NotificationStatus } from './NotificationStatus';

export class Notification extends Model {
    public id?: number;
    public title?: string;
    public content?: string;
    public organization?: Organization;

    public notificationStatus?: NotificationStatus;
    public notificationStatusId?: number;

}