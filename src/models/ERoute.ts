import { Model } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from './AppUser';
import { ERouteType } from './ERouteType';
import { Status } from './Status';
import { ERouteContent } from './ERouteContent';
import { Organization } from './Organization';

export class ERoute extends Model
{
    public id?: number;

    public code?: string;

    public name?: string;
    public startDate?: Moment;

    public endDate?: Moment;

    public eRouteTypeId?: number;

    public requestStateId?: number;

    public statusId?: number = 1;

    public creatorId?: number;
    public creator?: AppUser;
    public eRouteType?: ERouteType;
    public saleEmployee?: AppUser;

    public saleEmployeeId?: number;
    public status?: Status;
    public eRouteContents?: ERouteContent[];
    public organization?: Organization;
    public organizationId?: number;
}
