import { Model } from 'core/models';
import { EnumList } from 'models/EnumList';
import { Moment } from 'moment';

export class StoreCompetitorsTableData extends Model {
    public id?: number;
    public organizationId?: number;
    public saleEmployeeId?: number;
    public indirectSalesOrderId?: number;
    public checkingId?: number;
    public imageId?: number;
    public displayName?: string;
    public username?: string;
    public organizationName?: string;
    public checking?: EnumList;
    public image?: EnumList;
    public checkIn?: Moment;
    public date?: Moment;
    public planCounter?: number;
    public internalCounter?: number;
    public externalCounter?: number;
    public imageCounter?: number;
    public salesOrderCounter?: number;
    public revenueCounter?: number;
    public rowSpan?: number = 0;
}
