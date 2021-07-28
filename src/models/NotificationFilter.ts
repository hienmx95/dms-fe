import { StringFilter, IdFilter } from 'core/filters';
import { ModelFilter } from 'core/models';

export class NotificationFilter extends ModelFilter {
    public id?: IdFilter = new IdFilter();
    public title?: StringFilter = new StringFilter();
    public appUserId?: IdFilter = new IdFilter();
    public organizationId?: IdFilter = new IdFilter();
    public notificationStatusId?: IdFilter = new IdFilter();
}