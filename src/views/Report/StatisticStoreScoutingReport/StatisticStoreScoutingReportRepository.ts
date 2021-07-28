import { AxiosResponse } from 'axios';
import { API_STATISTIC_STORE_SCOUTING_REPORT_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { StatisticStoreScoutingReport } from 'models/report/StatisticStoreScoutingReport';
import { StatisticStoreScoutingReportFilter } from 'models/report/StatisticStoreScoutingReportFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import { PureModelData } from 'react3l';
import nameof from 'ts-nameof.macro';
import { StatisticStoreScoutingReportDataTable } from 'models/report/StatisticStoreScoutingReportDataTable';

export class StatisticStoreScoutingReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_STATISTIC_STORE_SCOUTING_REPORT_ROUTE));
  }
  public count = (filter?: StatisticStoreScoutingReportFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), filter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (filter?: StatisticStoreScoutingReportFilter): Promise<StatisticStoreScoutingReport[]> => {
    return this.http
      .post<StatisticStoreScoutingReport[]>(kebabCase(nameof(this.list)), filter)
      .then((response: AxiosResponse<StatisticStoreScoutingReport[]>) => {
        return response.data?.map((model: PureModelData<StatisticStoreScoutingReport>) =>
          StatisticStoreScoutingReport.clone<StatisticStoreScoutingReport>(model),
        );
      });
  };
  public get = (id: number | string): Promise<StatisticStoreScoutingReport> => {
    return this.http
      .post<StatisticStoreScoutingReport>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<StatisticStoreScoutingReport>) =>
        StatisticStoreScoutingReport.clone<StatisticStoreScoutingReport>(response.data),
      );
  };


  public filterListProvince = (
    provinceFilter: ProvinceFilter,
  ): Promise<Province[]> => {
    return this.http
      .post<Province[]>(
        kebabCase(nameof(this.filterListProvince)),
        provinceFilter,
      )
      .then((response: AxiosResponse<Province[]>) => {
        return response.data.map((province: PureModelData<Province>) =>
          Province.clone<Province>(province),
        );
      });
  };

  public filterListWard = (wardFilter: WardFilter): Promise<Ward[]> => {
    return this.http
      .post<Ward[]>(kebabCase(nameof(this.filterListWard)), wardFilter)
      .then((response: AxiosResponse<Ward[]>) => {
        return response.data.map((ward: PureModelData<Ward>) =>
          Ward.clone<Ward>(ward),
        );
      });
  };

  public filterListDistrict = (
    districtFilter: DistrictFilter,
  ): Promise<District[]> => {
    return this.http
      .post<District[]>(
        kebabCase(nameof(this.filterListDistrict)),
        districtFilter,
      )
      .then((response: AxiosResponse<District[]>) => {
        return response.data.map((district: PureModelData<District>) =>
          District.clone<District>(district),
        );
      });
  };

  public total = (filter?: StatisticStoreScoutingReportFilter): Promise<StatisticStoreScoutingReportDataTable> => {
    return this.http
      .post<StatisticStoreScoutingReportDataTable>(kebabCase(nameof(this.total)), filter)
      .then((response: AxiosResponse<StatisticStoreScoutingReportDataTable>) => response.data);
  };
  public export = (statisticStoreScoutingReportFilter?: StatisticStoreScoutingReportFilter): Promise<AxiosResponse<any>> => {
    return this.http.post('export', statisticStoreScoutingReportFilter, {
      responseType: 'arraybuffer',
    });
  };
}
export const statisticStoreScoutingReportRepository: StatisticStoreScoutingReport = new StatisticStoreScoutingReportRepository();
