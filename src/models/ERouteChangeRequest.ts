import { Model } from 'core/models';
import { AppUser } from './AppUser';
import { ERoute } from './ERoute';
import { ERouteChangeRequestContent } from './ERouteChangeRequestContent';

export class ERouteChangeRequest extends Model
{
    public id?: number;
    public eRouteId?: number;
    public creatorId?: number;
    public requestStateId?: number;
    public creator?: AppUser;
    public eRoute?: ERoute;
    public eRouteChangeRequestContents?: ERouteChangeRequestContent[];
}
