import { Model } from 'core/models';
import { AppUser } from './AppUser';
import { District } from './District';
import { Organization } from './Organization';
import { Province } from './Province';
import { StoreScoutingStatus } from './StoreScoutingStatus';
import { StoreScoutingType } from './StoreScoutingType';
import { Ward } from './Ward';

export class StoreScouting extends Model {
    public id?: number;

    public code?: string;

    public name?: string;

    public ownerPhone?: string;

    public provinceId?: number;

    public districtId?: number;

    public wardId?: number;

    public organizationId?: number;

    public address?: string;

    public latitude?: number;

    public longitude?: number;

    public creatorId?: number;

    public storeScoutingStatusId?: number;
    public creator?: AppUser;

    public district?: District;

    public organization?: Organization;

    public province?: Province;

    public storeScoutingStatus?: StoreScoutingStatus;

    public ward?: Ward;
    public link?: string;
    public storeScoutingType?: StoreScoutingType;
    public storeScoutingTypeId?: number;
}
