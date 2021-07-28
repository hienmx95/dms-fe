import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Store } from 'models/Store';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
export interface StorePreviewIProps {
  previewModel: Store;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function StorePreview(props: StorePreviewIProps) {
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
          <Descriptions.Item label={translate('stores.codeDraft')}>
            {previewModel?.codeDraft}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.organization')}>
            {previewModel?.organization?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.storeType')}>
            {previewModel?.storeType?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.storeGrouping')}>
            {previewModel?.storeGrouping?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.telephone')}>
            {previewModel?.telephone}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.address1')}>
            <Tooltip title={previewModel?.address} placement="bottom">
              {limitWord(previewModel.address, 20)}
            </Tooltip>
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.deliveryAddress')}>
            <Tooltip title={previewModel?.deliveryAddress} placement="bottom">
              {limitWord(previewModel.deliveryAddress, 20)}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label={translate('stores.latitude')}>
            {previewModel?.latitude}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.longitude')}>
            {previewModel?.longitude}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.ownerName')}>
            {previewModel?.ownerName}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.ownerPhone')}>
            {previewModel?.ownerPhone}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.ownerEmail')}>
            {previewModel?.ownerEmail}
          </Descriptions.Item>
          <Descriptions.Item label={translate('stores.storeStatus')}>
            {previewModel?.storeStatus?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('stores.username')}>
            {previewModel?.storeUser?.username}
          </Descriptions.Item>
          <Descriptions.Item label={translate('stores.storeUserStatus')}>
            {previewModel?.storeUser
              ? previewModel?.storeUser?.status?.id
                ? 'Đã mở'
                : 'Đã khóa'
              : 'Chưa mở'}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
