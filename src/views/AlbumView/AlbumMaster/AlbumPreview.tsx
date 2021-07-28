import React from 'react';
import { Album } from 'models/Album';
import { useTranslation } from 'react-i18next';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Spin, Descriptions } from 'antd';

export interface AlbumPreviewProps {
    model : Album;
    previewVisible: boolean;
    onClose: () => void;
    previewLoading: boolean;
}

export default function AlbumPreview(props : AlbumPreviewProps ) {
    const {model, previewVisible, onClose, previewLoading} = props;
    const [translate] = useTranslation();
    return (
        <MasterPreview
        isOpen={previewVisible}
        onClose={onClose}
        title={model.name}
        statusId={model.statusId}
        size="xl"
      >
        <Spin spinning={previewLoading}>
          <Descriptions>
            <Descriptions.Item label={translate('albums.name')}>
              {model?.name}
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </MasterPreview>
    );
}
