import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { ShowingItem } from 'models/posm/ShowingItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ShowingItemPreviewIProps {
  previewModel: ShowingItem;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function SupplierPreview(props: ShowingItemPreviewIProps) {
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
        <Descriptions column={8}>
          <Descriptions.Item label={translate('showingItems.id')}>
            {previewModel?.id}
          </Descriptions.Item>
          <Descriptions.Item>
            <div className={previewModel?.statusId === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <Spin spinning={previewLoading}>
        <Descriptions column={5}>
          <Descriptions.Item label={translate('showingItems.unitOfMeasure')}>
            {previewModel?.UnitOfMeasureId?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('showingItems.salePrice')}>
            {previewModel?.salePrice}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
