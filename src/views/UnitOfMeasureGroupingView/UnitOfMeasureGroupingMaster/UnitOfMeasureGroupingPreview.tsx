import { Descriptions, Spin } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { limitWord } from 'core/helpers/string';
import { Tooltip } from 'antd';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import UnitOfMeasureGroupingContentTable from '../UnitOfMeasureGroupingDetail/UnitOfMeasureGroupingContentTable/UnitOfMeasureGroupingContentTable';
import nameof from 'ts-nameof.macro';
export interface UnitOfMeasureGroupingPreviewIProps {
  previewModel: UnitOfMeasureGrouping;
  setPreviewModel: React.Dispatch<React.SetStateAction<UnitOfMeasureGrouping>>;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}

export default function UnitOfMeasureGroupingPreview(
  props: UnitOfMeasureGroupingPreviewIProps,
) {
  const {
    previewModel,
    setPreviewModel,
    previewVisible,
    onClose,
    previewLoading,
  } = props;
  const [translate] = useTranslation();
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());
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
          <Descriptions.Item
            label={translate('unitOfMeasureGroupings.unitOfMeasure')}
          >
            {previewModel?.unitOfMeasure && previewModel.unitOfMeasure.name}
          </Descriptions.Item>
          <Descriptions.Item
            label={translate('unitOfMeasureGroupings.description')}
          >
            <Tooltip title={previewModel?.description} placement="bottom">
              {limitWord(previewModel.description, 20)}
            </Tooltip>
          </Descriptions.Item>
        </Descriptions>
        <div className="d-flex mt-4">
          <UnitOfMeasureGroupingContentTable
            model={previewModel}
            setModel={setPreviewModel}
            filter={unitOfMeasureFilter}
            field={nameof(previewModel.unitOfMeasureGroupingContents)}
            setFilter={setUnitOfMeasureFilter}
            unitOfMeasureGrouping={previewModel}
            isPreview={true}
          />
        </div>
      </Spin>
    </MasterPreview>
  );
}
