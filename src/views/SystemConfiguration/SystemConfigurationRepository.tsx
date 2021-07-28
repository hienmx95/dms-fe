import { AxiosResponse } from 'axios';
import { API_SYSTEM_CONFIGURATION_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { SystemConfiguration } from 'models/SystemConfiguration';
import nameof from 'ts-nameof.macro';
export class SystemConfigurationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_SYSTEM_CONFIGURATION_ROUTE));
  }

  public get = (): Promise<SystemConfiguration> => {
    return this.http
      .post<SystemConfiguration>(kebabCase(nameof(this.get)))
      .then((response: AxiosResponse<SystemConfiguration>) =>
        SystemConfiguration.clone<SystemConfiguration>(response.data),
      );
  };
  public update = (systemConfiguration: SystemConfiguration): Promise<SystemConfiguration> => {
    return this.http.post<SystemConfiguration>(kebabCase(nameof(this.update)), systemConfiguration)
      .then((response: AxiosResponse<SystemConfiguration>) => SystemConfiguration.clone<SystemConfiguration>(response.data));
  };
}
export const systemConfigurationRepository: SystemConfigurationRepository = new SystemConfigurationRepository();