import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Role } from 'models/Role';
import React from 'react';
import { useTranslation } from 'react-i18next';
export interface RolePreviewIProps {
  previewModel: Role;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function RolePreview(props: RolePreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      code={previewModel.code}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions title={previewModel.name}>
          <Descriptions.Item label={translate('roles.id')}>
            {previewModel?.id}
          </Descriptions.Item>

          <Descriptions.Item label={translate('roles.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('roles.name')}>
            {previewModel?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('roles.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
