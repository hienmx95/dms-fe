import { Descriptions, Spin, Row, Col } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Banner } from 'models/Banner';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './BannerMaster.scss';
import { formatDate } from 'core/helpers/date-time';
import { v4 as uuidv4 } from 'uuid';
export interface BannerPreviewIProps {
  preViewModel: Banner;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function BannerPreview(props: BannerPreviewIProps) {
  const { preViewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  const renderView = React.useMemo(() => {
    return (
      <div>
        {preViewModel?.images &&
          preViewModel?.images?.length > 0 &&
          preViewModel.images.map(item => (
            <div key={item.id ? item.id : uuidv4()}>
              <img src={item?.url} width="400" height="200" alt="" />
            </div>
          ))}
      </div>
    );
  }, [preViewModel]);

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={preViewModel.title}
    >
      <Spin spinning={previewLoading}>
        <div className="banner-preview">
          <Row>
            <Col span={6}>
              <Descriptions>
                <Descriptions.Item label={translate('banners.priority')}>
                  {preViewModel?.priority}
                </Descriptions.Item>

              </Descriptions>
              <Descriptions>
                <Descriptions.Item label={translate('banners.status')}>
                  {preViewModel?.status && preViewModel?.status?.name}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions>
                <Descriptions.Item label={translate('banners.creator')}>
                  {preViewModel?.creator && preViewModel?.creator?.displayName}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions>
                <Descriptions.Item label={translate('banners.createAt')}>
                  {formatDate(preViewModel?.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <div className="d-flex justify-content-between">
                <span className="label-input">
                  {translate('banners.image')}
                </span>
                <div className="mr-1">
                  {renderView}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Descriptions className="banner-content ">
              <Descriptions.Item >
                <span className="label-input">{translate('banners.content')}</span>
                <div className="mt-3" contentEditable="false" dangerouslySetInnerHTML={{ __html: preViewModel?.content }}></div>
              </Descriptions.Item>
            </Descriptions>
          </Row>
        </div>
      </Spin>
    </MasterPreview>
  );
}
