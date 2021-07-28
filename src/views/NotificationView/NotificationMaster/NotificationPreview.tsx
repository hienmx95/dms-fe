import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from 'models/Notification';
import './NotificationMaster.scss';
export interface NotificationPreviewProps {
  model: Notification;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function NotificationPreview(props: NotificationPreviewProps) {
  const { model, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={model.title}
    >
      <Spin spinning={previewLoading}>
        <Descriptions>
          <Descriptions.Item label={translate('notifications.organization')}>
            {model?.organization && model?.organization?.name}
          </Descriptions.Item>

        </Descriptions>
        <div className="d-flex">
          <div className="label-preview">{translate('notifications.content')} : </div>
          <div>

            <div dangerouslySetInnerHTML={{ __html: model?.content }} className="content-color"></div>

          </div>
        </div>

      </Spin>
    </MasterPreview>
  );
}
