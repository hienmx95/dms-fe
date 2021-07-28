import { Descriptions, Spin } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalLanguageKeys } from 'config/consts';
import { formatDate } from 'core/helpers/date-time';
import { formatNumber } from 'core/helpers/number';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { WorkflowDirection } from 'models/WorkflowDirection';
import { WorkflowDirectionCondition } from 'models/WorkflowDirectionCondition';
import { WorkflowOperator } from 'models/WorkflowOperator';
import { WorkflowParameter } from 'models/WorkflowParameter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { workflowDirectionRepository } from '../WorkflowDirectionRepository';

export interface WorkflowDirectionProps {
  previewModel: WorkflowDirection;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
}
export default function WorkflowDirectionPreview(
  props: WorkflowDirectionProps,
) {
  const [translate] = useTranslation();
  const { previewModel, previewVisible, onClose, previewLoading } = props;

  const [organizationFilter] = React.useState<OrganizationFilter>(
    new OrganizationFilter(),
  );

  const [organizationList, setOrganizationList] = React.useState<Organization>(
    [],
  );
  React.useEffect(() => {
    workflowDirectionRepository
      .singleListOrganization2(organizationFilter)
      .then(res => {
        setOrganizationList(res);
      });
  }, [setOrganizationList, organizationFilter]);

  const columnsPopup: ColumnProps<WorkflowDirectionCondition>[] = [
    {
      title: translate(generalLanguageKeys.columns.index),
      key: nameof(generalLanguageKeys.index),
      width: 100,
      render: renderMasterIndex<WorkflowDirectionCondition>(),
    },
    {
      title: translate('workflowDirectionConditions.workflowParameterId'),
      key: nameof(
        previewModel.workflowDirectionConditions[0].workflowParameter,
      ),
      dataIndex: nameof(
        previewModel.workflowDirectionConditions[0].workflowParameter,
      ),
      align: 'left',
      render(item: WorkflowParameter) {
        return item?.name;
      },
      ellipsis: true,
    },
    {
      title: translate('workflowDirectionConditions.workflowOperator'),
      key: nameof(previewModel.workflowDirectionConditions[0].workflowOperator),
      dataIndex: nameof(
        previewModel.workflowDirectionConditions[0].workflowOperator,
      ),
      align: 'left',
      render(item: WorkflowOperator) {
        return item?.name;
      },
      ellipsis: true,
    },
    {
      title: translate('workflowDirectionConditions.value'),
      key: nameof(previewModel.workflowDirectionConditions[0].value),
      dataIndex: nameof(previewModel.workflowDirectionConditions[0].value),
      align: 'left',
      render(...[value, content]) {
        return renderValue(
          content?.workflowParameter?.workflowParameterTypeId,
          value,
        );
      },
    },
  ];

  const renderValue = React.useMemo(() => {
    return (type, value) => {
      switch (type) {
        /* singleList */
        case 1:
          const org = organizationList.filter(
            item => item.id === Number(value),
          );
          return (
            <>
              {org && org?.length > 0 && org[0]?.id && <div>{org[0].name}</div>}
            </>
          );
        /* string */
        case 2:
          return <>{value}</>;
        /* Long or decimal */
        case 3:
          return <>{formatNumber(Number(value))}</>;
        case 4:
          return <>{formatNumber(Number(value))}</>;
        /* date */
        case 5:
          return <>{formatDate(value)}</>;
      }
    };
  }, [organizationList]);

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={previewModel?.workflowDefinition?.name}
      code={previewModel.code}
      statusId={previewModel.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item
            label={translate('workflowDirections.workflowDefinition')}
          >
            {previewModel?.workflowDefinition?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('workflowDirections.fromStep')}>
            {previewModel?.fromStep?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('workflowDirections.toStep')}>
            {previewModel?.toStep?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions column={4}>
          <Descriptions.Item label={''}>{}</Descriptions.Item>
          <Descriptions.Item label={translate('workflowDirections.role')}>
            {previewModel?.fromStep?.role?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('workflowDirections.role')}>
            {previewModel?.toStep?.role?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={translate('workflowDirections.workflowDirectionConditions')}
          column={1}
        >
          <Descriptions.Item>
            <Table
              dataSource={previewModel.workflowDirectionConditions}
              columns={columnsPopup}
              size="small"
              tableLayout="fixed"
              rowKey={nameof(previewModel.id)}
              pagination={false}
              scroll={{ y: 500 }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
