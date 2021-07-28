import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Brand } from 'models/Brand';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface BrandPreviewIProps {
  previewModel: Brand;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function BrandPreview(props: BrandPreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('brands.id')}>
            {previewModel?.id}
          </Descriptions.Item>
          <Descriptions.Item label={translate('brands.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('brands.name')}>
            <Tooltip title={previewModel?.name} placement="bottom">
              {limitWord(previewModel.name, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('brands.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
