import { Status } from './../Status';
import { Organization } from './../Organization';
import { AppUser } from './../AppUser';
import { Model } from 'core/models';
import { KpiYear } from './KpiYear';
import { KpiGeneralContent } from './KpiGeneralContent';

export class KpiGeneral extends Model
{
    public id?: number;

    public organizationId?: number;

    public employeeId?: number;

    public kpiYearId?: number;

    public statusId?: number = 1;

    public creatorId?: number;

    public creator?: AppUser;

    public employee?: AppUser;

    public kpiYear?: KpiYear;

    public organization?: Organization;

    public status?: Status;

    public kpiGeneralContents?: KpiGeneralContent[];
}
