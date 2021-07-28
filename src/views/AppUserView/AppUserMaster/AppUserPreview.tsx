import React from 'react';
import { AppUser } from 'models/AppUser';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { formatDate } from 'core/helpers/date-time';

export interface AppUserPreviewProps {
  previewModel: AppUser;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function AppUserPreview(props: AppUserPreviewProps) {
  const { previewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.displayName}
      code={previewModel.username}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('appUsers.address')}>
            {previewModel?.address}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.sex')}>
            {previewModel?.sex?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.organization')}>
            {previewModel?.organization?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.birthday')}>
            {previewModel?.birthday ? formatDate(previewModel?.birthday) : null}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.email')}>
            {previewModel?.email}
          </Descriptions.Item>
          <Descriptions.Item label={translate('appUsers.phone')}>
            {previewModel?.phone}
          </Descriptions.Item>
          {/* <Descriptions.Item label={translate('appUsers.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item> */}
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
