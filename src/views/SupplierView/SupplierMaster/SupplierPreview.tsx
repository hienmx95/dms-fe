import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Supplier } from 'models/Supplier';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface SupplierPreviewIProps {
  previewModel: Supplier;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function SupplierPreview(props: SupplierPreviewIProps) {
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
          <Descriptions.Item label={translate('suppliers.id')}>
            {previewModel?.id}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.code')}>
            {previewModel?.code}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.name')}>
            <Tooltip placement="bottomLeft" title={previewModel?.name}>
              {limitWord(previewModel?.name, 30)}
            </Tooltip>
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.taxCode')}>
            {previewModel?.taxCode}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.phone')}>
            {previewModel?.phone}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.email')}>
            {previewModel?.email}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.address')}>
            <Tooltip placement="bottomLeft" title={previewModel?.address}>
              {limitWord(previewModel?.address, 30)}
            </Tooltip>
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.ownerName')}>
            {previewModel?.ownerName}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.description')}>
            {previewModel?.description}
          </Descriptions.Item>

          <Descriptions.Item label={translate('suppliers.status')}>
            {previewModel?.status?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
