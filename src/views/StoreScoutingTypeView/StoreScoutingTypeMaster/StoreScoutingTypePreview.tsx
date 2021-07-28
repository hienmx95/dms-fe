import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StoreScoutingType } from 'models/StoreScoutingType';
export interface StoreScoutingTypePreviewIProps {
  previewModel: StoreScoutingType;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function StoreScoutingTypePreview(props: StoreScoutingTypePreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="l"
      title={previewModel.name}
      code={previewModel.code}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={2}>
          <Descriptions.Item label={translate('problemTypes.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('problemTypes.name')}>
            {previewModel?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
