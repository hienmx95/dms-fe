import { Status } from './../Status';
import { Organization } from './../Organization';
import { AppUser } from './../AppUser';
import { Model } from 'core/models';
import { KpiPeriod } from './KpiPeriod';
import { KpiProductGroupingContent } from './KpiProductGroupingContent';
import { KpiItemKpiCriteriaTotalMapping } from './KpiItemKpiCriteriaTotalMapping';
import { Moment } from 'moment';
import { KpiYear } from './KpiYear';

export class KpiProductGrouping extends Model {
  public id?: number;

  public organizationId?: number;

  public kpiYearId?: number;

  public kpiPeriodId?: number;

  public statusId?: number = 1;

  public employeeId?: number;

  public creatorId?: number;

  public creator?: AppUser;

  public employee?: AppUser;

  public kpiPeriod?: KpiPeriod;

  public organization?: Organization;

  public status?: Status;

  public kpiProductGroupingContents?: KpiProductGroupingContent[];

  public kpiItemKpiCriteriaTotalMappings?: KpiItemKpiCriteriaTotalMapping[];
  public createdAt?: Moment;
  public kpiYear?: KpiYear;

  public kpiProductGroupingTypeId?: number;

  public kpiProductGroupingType?: Status;
}
