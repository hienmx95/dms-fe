import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { StoreGrouping } from 'models/StoreGrouping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface StoreGroupingPreviewIProps {
  previewModel: StoreGrouping;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function StoreGroupingPreview(props: StoreGroupingPreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      code={previewModel?.code}
      statusId={previewModel?.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('storeGroupings.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('storeGroupings.name')}>
            <Tooltip title={previewModel?.name} placement="bottom">
              {limitWord(previewModel.name, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('storeGroupings.isActive')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
