/* tslint:disable:variable-name */
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { createHttpService } from '../helpers/http';

export class Repository {
  private static _defaultRequestInterceptor: (
    v: AxiosRequestConfig,
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

  private static _defaultResponseInterceptor: (
    v: AxiosResponse<any>,
  ) => AxiosResponse<any> | Promise<AxiosResponse<any>>;

  private static _defaultErrorInterceptor: (
    error: AxiosError<any>,
  ) => Promise<void>;

  protected http: AxiosInstance;

  constructor(
    config?: AxiosRequestConfig,
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig,
    responseInterceptor?: <T>(response: AxiosResponse<T>) => AxiosResponse<T>,
    errorInterceptor?: (error: AxiosError<any>) => Promise<void>,
  ) {
    this.http = createHttpService(
      config,
      requestInterceptor,
      responseInterceptor,
      errorInterceptor,
    );
    if (typeof Repository._defaultRequestInterceptor === 'function') {
      this.http.interceptors.request.use(Repository._defaultRequestInterceptor);
    }
    if (
      typeof Repository._defaultResponseInterceptor === 'function' &&
      typeof Repository._defaultErrorInterceptor === 'function'
    ) {
      this.http.interceptors.response.use(
        Repository._defaultResponseInterceptor,
        Repository._defaultErrorInterceptor,
      );
    }
  }

  public setBaseURL(baseURL: string) {
    this.http.defaults.baseURL = baseURL;
  }

  public getHttpInstance(): AxiosInstance {
    return this.http;
  }

  static set defaultRequestInterceptor(
    value: (
      v: AxiosRequestConfig,
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  ) {
    this._defaultRequestInterceptor = value;
  }

  static set defaultResponseInterceptor(
    value: (
      v: AxiosResponse<any>,
    ) => AxiosResponse<any> | Promise<AxiosResponse<any>>,
  ) {
    this._defaultResponseInterceptor = value;
  }

  static set defaultErrorInterceptor(
    value: (error: AxiosError<any>) => Promise<void>,
  ) {
    this._defaultErrorInterceptor = value;
  }
}
