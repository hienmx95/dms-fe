import { WorkflowStep } from 'models/WorkflowStep';
import React from 'react';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { Descriptions, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import './WorkflowStepMaster.scss';


export interface WorkflowStepPreviewProps {
  previewModel: WorkflowStep;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading?: boolean;
}

export default function WorkflowStepPreview(props: WorkflowStepPreviewProps) {
  const { previewModel, previewVisible, previewLoading, onClose } = props;
  const [translate] = useTranslation();
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel.name}
      code={previewModel.code}
      statusId={previewModel.statusId}
      className="step-preview"
    >
      <Spin spinning={previewLoading}>
        <Descriptions >
          <Descriptions.Item label={translate('workflowSteps.role')}>
            {previewModel?.role?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('workflowSteps.workflowDefinition')}>
            {previewModel?.workflowDefinition?.name}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}

