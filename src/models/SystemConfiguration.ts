import { Model } from 'core/models';

export class SystemConfiguration extends Model {
  // tslint:disable-next-line: variable-name
  public storE_CHECKING_DISTANCE?: number;
  // tslint:disable-next-line: variable-name
  public storE_CHECKING_OFFLINE_CONSTRAINT_DISTANCE?: boolean;
  // tslint:disable-next-line: variable-name
  public usE_DIRECT_SALES_ORDER?: boolean;
  // tslint:disable-next-line: variable-name
  public usE_INDIRECT_SALES_ORDER?: boolean;
  // tslint:disable-next-line: variable-name
  public alloW_EDIT_KPI_IN_PERIOD?: boolean;
  // tslint:disable-next-line: variable-name
  public prioritY_USE_PRICE_LIST?: number;
  // tslint:disable-next-line: variable-name
  public prioritY_USE_PROMOTION?: number;
  // tslint:disable-next-line: variable-name
  public storE_CHECKING_MINIMUM_TIME?: number;
  // tslint:disable-next-line: variable-name
  public dasH_BOARD_REFRESH_TIME?: number;
  // tslint:disable-next-line: variable-name
  public amplitudE_PRICE_IN_DIRECT?: number;
  // tslint:disable-next-line: variable-name
  public amplitudE_PRICE_IN_INDIRECT?: number;
  public YOUTUBE_ID?: string;
}
