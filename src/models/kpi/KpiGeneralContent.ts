import { Status } from './../Status';
import { Model } from 'core/models';
import { KpiCriteriaGeneral } from './KpiCriteriaGeneral';
import { KpiGeneral } from './KpiGeneral';

export class KpiGeneralContent extends Model {
  public id?: number;

  public kpiGeneralId?: number;

  public kpiCriteriaGeneralId?: number;

  public statusId?: number;
  public kpiCriteriaGeneral?: KpiCriteriaGeneral;
  public kpiGeneral?: KpiGeneral;
  public kpiGeneralContentKpiPeriodMappings?: Record<string, number>;

  public kpiGeneralContentKpiPeriodMappingEnables?: Record<string, boolean>;
  public status?: Status;
  public jan?: number;
  public feb?: number;
  public mar?: number;
  public apr?: number;
  public jun?: number;
  public jul?: number;
  public may?: number;
  public aug?: number;
  public sep?: number;
  public oct?: number;
  public nov?: number;
  public dec?: number;
  public q1?: number;
  public q2?: number;
  public q3?: number;
  public q4?: number;
  public year?: number;
  public janStatus?: boolean;
  public febStatus?: boolean;
  public marStatus?: boolean;
  public aprStatus?: boolean;
  public junStatus?: boolean;
  public julStatus?: boolean;
  public mayStatus?: boolean;
  public augStatus?: boolean;
  public sepStatus?: boolean;
  public octStatus?: boolean;
  public novStatus?: boolean;
  public decStatus?: boolean;
  public q1Status?: boolean;
  public q2Status?: boolean;
  public q3Status?: boolean;
  public q4Status?: boolean;
  public yearStatus?: boolean;
}
