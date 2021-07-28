import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SystemConfiguration } from 'models/SystemConfiguration';
class PermissionService {
  protected http: AxiosInstance;

  constructor() {
    this.http = createHttpService();
  }
  public listPath() {
    return this.http
      .post('rpc/dms/permission/list-path', {})
      .then((response: AxiosResponse<string[]>) => response.data);
  }
  public listPathMDM() {
    return this.http
      .post('rpc/mdm/permission/list-path', {})
      .then((response: AxiosResponse<string[]>) => response.data);
  }

  public getSystemConfig = (): Promise<SystemConfiguration> => {
    return this.http
      .post<SystemConfiguration>('rpc/dms/system-configuration/get', {})
      .then((response: AxiosResponse<SystemConfiguration>) =>
        SystemConfiguration.clone<SystemConfiguration>(response.data),
      );
  };
}

const createHttpService = () => {
  const instance: AxiosInstance = axios.create(httpConfig);
  return instance;
};

const httpConfig: AxiosRequestConfig = {
  baseURL: window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export default new PermissionService();
