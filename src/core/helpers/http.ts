import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

export function createHttpService(
  config: AxiosRequestConfig,
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig,
  responseInterceptor?: (response: AxiosResponse) => any,
  errorInterceptor?: (error: AxiosError<any>) => Promise<void>,
): AxiosInstance {
  const instance: AxiosInstance = axios.create(config);
  if (requestInterceptor) {
    instance.interceptors.request.use(requestInterceptor);
  }
  if (responseInterceptor && errorInterceptor) {
    instance.interceptors.response.use(responseInterceptor, errorInterceptor);
  }
  return instance;
}
