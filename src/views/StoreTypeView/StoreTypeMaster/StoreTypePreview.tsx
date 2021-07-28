import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { StoreType } from 'models/StoreType';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface StoreTypePreviewIProps {
  previewModel: StoreType;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function StoreTypePreview(props: StoreTypePreviewIProps) {
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
        <Descriptions column={4}>
          <Descriptions.Item label={translate('storeTypes.code')}>
            {previewModel?.code}
          </Descriptions.Item>
          <Descriptions.Item label={translate('storeTypes.name')}>
            <Tooltip title={previewModel?.name} placement="bottom">
              {limitWord(previewModel.name, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('storeTypes.status')}>
            {previewModel?.status && previewModel.status.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('storeTypes.color')}>
            {previewModel?.color && (
              <div className="form-color">
                <div className="color mr-2" style={{ backgroundColor: `${previewModel?.color?.code}`, border: `1px solid #e8e8e8` }} />
                <div style={{ marginTop: `5px` }}>{previewModel?.color?.name}</div>
              </div>
            )}
          </Descriptions.Item>


        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
