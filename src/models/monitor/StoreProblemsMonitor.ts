import { Model, ModelFilter } from 'core/models';
import { Moment } from 'moment';
import { AppUser } from 'models/AppUser';
import { Store } from 'models/Store';
import { IdFilter, NumberFilter, DateFilter, StringFilter } from 'core/filters';
import { Organization } from 'models/Organization';

export class StoreProblemsMonitor extends Model {
  public id?: number;
  public rowId?: any;
  public organizationId?: any;
  public code?: string;
  public content?: string;
  public storeId?: number;
  public creatorId?: number;
  public problemTypeId?: number;
  public noteAt?: Moment;
  public completedAt?: Moment;
  public problemStatusId?: number;
  public creator?: AppUser;
  public problemStatus?: ProblemStatus;
  public store?: Store;
  public organization?: Organization;
}

export class StoreProblemsHistoryMonitor extends Model {
  public id?: number;
  public problemStatusId?: number;
  public modifierId?: number;
  public problemId?: number;
  public time?: Moment;
  public modifier?: AppUser;
  public problemStatus?: ProblemStatus;
}

export class StoreProblemsHistoryMonitorFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public problemStatusId?: IdFilter = new IdFilter();
  public modifierId?: IdFilter = new IdFilter();
  public problemId?: IdFilter = new IdFilter();
  public time?: DateFilter = new DateFilter();
}

export class ProblemStatus extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
}

export class ProblemStatusFilter extends ModelFilter {
  public id?: NumberFilter = new NumberFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
}

export class ProblemType extends Model {
  public id?: number;
  public code?: string;
  public name?: string;
}

export class ProblemTypeFilter extends ModelFilter {
  public id?: NumberFilter = new NumberFilter();
  public code?: StringFilter = new StringFilter();
  public name?: StringFilter = new StringFilter();
}

export class StoreChecking extends Model {
  public id?: number;
  public storeId?: number;
  public saleEmployeeId?: number;
  public longtitude?: number;
  public latitude?: number;
  public checkInAt?: Moment;
  public checkOutAt?: Moment;
  public indirectSalesOrderCounter?: number;
  public imageCounter?: number;
}

export class StoreCheckingFilter extends ModelFilter {
  public id?: IdFilter = new IdFilter();
  public storeId?: IdFilter = new IdFilter();
  public saleEmployeeId?: IdFilter = new IdFilter();
  public longtitude?: NumberFilter = new NumberFilter();
  public latitude?: NumberFilter = new NumberFilter();
  public checkInAt?: DateFilter = new DateFilter();
  public checkOutAt?: DateFilter = new DateFilter();
  public indirectSalesOrderCounter?: NumberFilter = new NumberFilter();
  public imageCounter?: NumberFilter = new NumberFilter();
}
