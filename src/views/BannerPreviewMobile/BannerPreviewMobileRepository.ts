import { Banner } from './../../models/Banner';
import { AxiosResponse } from 'axios';
import kebabCase from 'lodash/kebabCase';
import { url } from 'core/helpers/string';
import { API_BASE_URL } from 'core/config';
import { httpConfig } from 'config/http';
import { Repository } from 'core/repositories/Repository';
import { API_MOBILE_BANNER_ROUTE } from 'config/api-consts';
import nameof from 'ts-nameof.macro';
export class BannerPreviewMobileRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_MOBILE_BANNER_ROUTE));
  }

  public getBanner = (id: number | string): Promise<Banner> => {
    return this.http
      .post<Banner>(kebabCase(nameof(this.getBanner)), { id })
      .then((response: AxiosResponse<Banner>) =>
        Banner.clone<Banner>(response.data),
      );
  };
}

export const bannerPreviewRepository: Banner = new BannerPreviewMobileRepository();
