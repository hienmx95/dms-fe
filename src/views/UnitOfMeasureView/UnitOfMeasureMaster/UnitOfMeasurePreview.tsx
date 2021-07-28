import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface UnitOfMeasurePreviewIProps {
  previewModel: UnitOfMeasure;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function UnitOfMeasurePreview(props: UnitOfMeasurePreviewIProps) {
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
        <Descriptions>
          <Descriptions.Item label={translate('unitOfMeasures.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('unitOfMeasures.name')}>
            <Tooltip title={previewModel?.name} placement="bottom">
              {limitWord(previewModel.name, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('unitOfMeasures.status')}>
            {previewModel?.status && previewModel.status.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
