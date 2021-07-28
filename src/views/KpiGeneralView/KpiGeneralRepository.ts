import { buildTree } from './../../helpers/tree';
import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_KPI_GENERAL_ROUTE } from 'config/api-consts';
import { KpiGeneral } from 'models/kpi/KpiGeneral';
import { KpiGeneralFilter } from 'models/kpi/KpiGeneralFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { KpiYear } from 'models/kpi/KpiYear';
import { KpiYearFilter } from 'models/kpi/KpiYearFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { KpiGeneralContent } from 'models/kpi/KpiGeneralContent';
import { KpiGeneralContentFilter } from 'models/kpi/KpiGeneralContentFilter';
import { KpiCriteriaGeneral } from 'models/kpi/KpiCriteriaGeneral';
import { KpiCriteriaGeneralFilter } from 'models/kpi/KpiCriteriaGeneralFilter';

export class KpiGeneralRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_KPI_GENERAL_ROUTE));
  }

  public count = (kpiGeneralFilter?: KpiGeneralFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), kpiGeneralFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (
    kpiGeneralFilter?: KpiGeneralFilter,
  ): Promise<KpiGeneral[]> => {
    return this.http
      .post<KpiGeneral[]>(kebabCase(nameof(this.list)), kpiGeneralFilter)
      .then((response: AxiosResponse<KpiGeneral[]>) => {
        return response.data?.map((kpiGeneral: PureModelData<KpiGeneral>) =>
          KpiGeneral.clone<KpiGeneral>(kpiGeneral),
        );
      });
  };
  public countAppUser = (appUserFilter?: AppUserFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countAppUser)), appUserFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.listAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public get = (id: number | string): Promise<KpiGeneral> => {
    return this.http
      .post<KpiGeneral>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<KpiGeneral>) =>
        KpiGeneral.clone<KpiGeneral>(response.data),
      );
  };

  public create = (kpiGeneral: KpiGeneral): Promise<KpiGeneral> => {
    return this.http
      .post<KpiGeneral>(kebabCase(nameof(this.create)), kpiGeneral)
      .then((response: AxiosResponse<PureModelData<KpiGeneral>>) =>
        KpiGeneral.clone<KpiGeneral>(response.data),
      );
  };

  public update = (kpiGeneral: KpiGeneral): Promise<KpiGeneral> => {
    return this.http
      .post<KpiGeneral>(kebabCase(nameof(this.update)), kpiGeneral)
      .then((response: AxiosResponse<KpiGeneral>) =>
        KpiGeneral.clone<KpiGeneral>(response.data),
      );
  };

  public delete = (kpiGeneral: KpiGeneral): Promise<KpiGeneral> => {
    return this.http
      .post<KpiGeneral>(kebabCase(nameof(this.delete)), kpiGeneral)
      .then((response: AxiosResponse<KpiGeneral>) =>
        KpiGeneral.clone<KpiGeneral>(response.data),
      );
  };

  public save = (kpiGeneral: KpiGeneral): Promise<KpiGeneral> => {
    return kpiGeneral.id ? this.update(kpiGeneral) : this.create(kpiGeneral);
  };

  public filterListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListCreator = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.filterListCreator)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };
  public singleListAppUser = (
    appUserFilter: AppUserFilter,
  ): Promise<AppUser[]> => {
    return this.http
      .post<AppUser[]>(kebabCase(nameof(this.singleListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) =>
          AppUser.clone<AppUser>(appUser),
        );
      });
  };

  public filterListKpiYear = (): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(
        kebabCase(nameof(this.filterListKpiYear)),
        new KpiYearFilter(),
      )
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((kpiYear: PureModelData<KpiYear>) =>
          KpiYear.clone<KpiYear>(kpiYear),
        );
      });
  };
  public singleListKpiYear = (): Promise<KpiYear[]> => {
    return this.http
      .post<KpiYear[]>(
        kebabCase(nameof(this.singleListKpiYear)),
        new KpiYearFilter(),
      )
      .then((response: AxiosResponse<KpiYear[]>) => {
        return response.data.map((kpiYear: PureModelData<KpiYear>) =>
          KpiYear.clone<KpiYear>(kpiYear),
        );
      });
  };

  public filterListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.filterListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };
  public singleListOrganization = (
    organizationFilter: OrganizationFilter,
  ): Promise<Organization[]> => {
    return this.http
      .post<Organization[]>(
        kebabCase(nameof(this.singleListOrganization)),
        organizationFilter,
      )
      .then((response: AxiosResponse<Organization[]>) => {
        return buildTree(
          response.data.map((organization: PureModelData<Organization>) =>
            Organization.clone<Organization>(organization),
          ),
        );
      });
  };
  public singleListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.singleListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public filterListStatus = (): Promise<Status[]> => {
    return this.http
      .post<Status[]>(
        kebabCase(nameof(this.filterListStatus)),
        new StatusFilter(),
      )
      .then((response: AxiosResponse<Status[]>) => {
        return response.data.map((status: PureModelData<Status>) =>
          Status.clone<Status>(status),
        );
      });
  };
  public singleListKpiGeneralContent = (
    kpiGeneralContentFilter: KpiGeneralContentFilter,
  ): Promise<KpiGeneralContent[]> => {
    return this.http
      .post<KpiGeneralContent[]>(
        kebabCase(nameof(this.singleListKpiGeneralContent)),
        kpiGeneralContentFilter,
      )
      .then((response: AxiosResponse<KpiGeneralContent[]>) => {
        return response.data.map(
          (kpiGeneralContent: PureModelData<KpiGeneralContent>) =>
            KpiGeneralContent.clone<KpiGeneralContent>(kpiGeneralContent),
        );
      });
  };
  public singleListKpiCriteriaGeneral = (): Promise<KpiCriteriaGeneral[]> => {
    return this.http
      .post<KpiCriteriaGeneral[]>(
        kebabCase(nameof(this.singleListKpiCriteriaGeneral)),
        new KpiCriteriaGeneralFilter(),
      )
      .then((response: AxiosResponse<KpiCriteriaGeneral[]>) => {
        return response.data.map(
          (kpiCriteriaGeneral: PureModelData<KpiCriteriaGeneral>) =>
            KpiCriteriaGeneral.clone<KpiCriteriaGeneral>(kpiCriteriaGeneral),
        );
      });
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response: AxiosResponse<void>) => response.data);
  };
  public export = (
    kpiGeneralFilter?: KpiGeneralFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export', kpiGeneralFilter, {
      responseType: 'arraybuffer',
    });
  };

  public exportTemplate = (
    kpiGeneralFilter?: KpiGeneralFilter,
  ): Promise<AxiosResponse<any>> => {
    return this.http.post('export-template', kpiGeneralFilter, {
      responseType: 'arraybuffer',
    });
  };

  public getDraft = (kpiGeneral: KpiGeneral): Promise<KpiGeneral> => {
    return this.http
      .post<KpiGeneral>(kebabCase(nameof(this.getDraft)), kpiGeneral)
      .then((response: AxiosResponse<KpiGeneral>) =>
        KpiGeneral.clone<KpiGeneral>(response.data),
      );
  };
}

export const kpiGeneralRepository: KpiGeneral = new KpiGeneralRepository();
