import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { GlobalState } from 'core/config';
import * as Cookie from 'js-cookie';
import { AppUser } from 'models/AppUser';
import { setGlobal } from 'reactn';
import { LOGIN_ROUTE } from 'config/route-consts';
import { errorInterceptor, responseInterceptor } from 'config/http';
class AuthenticationService {
  protected http: AxiosInstance;

  constructor() {
    this.http = createHttpService();
  }

  public checkAuth() {
    return this.http
      .post('rpc/portal/profile-web/get')
      .then((response: AxiosResponse<AppUser>) => response.data);
  }
  public login(appUser: AppUser) {
    return this.http
      .post('rpc/portal/account/login', appUser)
      .then((response: AxiosResponse<AppUser>) => response.data);
  }

  public async logout() {
    Cookie.remove('Token');
    await setGlobal<GlobalState>({
      user: null,
    });
    window.location.href = `${LOGIN_ROUTE}?redirect=${window.location.pathname}`;
  }
}

const createHttpService = () => {
  const instance: AxiosInstance = axios.create(httpConfig);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor); // register fullfill and reject handler for http promise
  return instance;
};

const httpConfig: AxiosRequestConfig = {
  baseURL: window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export default new AuthenticationService();
