import React from 'react';
import './BannerPreviewMobile.scss';
import { useTranslation } from 'react-i18next';
import { Card, Spin } from 'antd';
import { crudService } from 'core/services';
import { bannerPreviewRepository } from './BannerPreviewMobileRepository';
import { Banner } from 'models/Banner';
import { formatDate } from 'core/helpers/date-time';

function BannerPreviewMobile() {
  const [translate] = useTranslation();

  // link mau: survey-form/17?storeId=17

  const [
    banner,
    ,
    loading,
  ] = crudService.useDetail(
    Banner,
    bannerPreviewRepository.getBanner,
    bannerPreviewRepository.saveSurveyForm,
  );

  return (
    <div className="page master-page banner-mobile survey">
      <Spin spinning={loading}>
        <Card >
          <div className="container">
            <div className="banner-title mt-3 mb-3">
              {banner?.title}
            </div>
            <div className="updated-at mb-3">
              {translate('bannerMobile.updatedAt')}: {formatDate(banner?.updatedAt)}
            </div>
            <div className="description">
              <div contentEditable="false" dangerouslySetInnerHTML={{ __html: banner?.content }}></div>
            </div>
          </div>
        </Card>
      </Spin>

    </div>
  );
}

export default BannerPreviewMobile;
