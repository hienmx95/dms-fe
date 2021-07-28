import React from 'react';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';
import { TaxType } from 'models/TaxType';

export interface TaxTypePreviewProps {
  previewModel: TaxType;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}


export default function TaxTypePreview(props: TaxTypePreviewProps) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading } = props;


  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
    >
      <Spin spinning={previewLoading}>
        <Descriptions  >

          <Descriptions.Item label={translate('taxTypes.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('taxTypes.name')}>
            {previewModel?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('taxTypes.percentage')}>
            {previewModel?.percentage} %
              </Descriptions.Item>

          <Descriptions.Item label={translate('taxTypes.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
