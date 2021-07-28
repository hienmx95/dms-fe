import { Descriptions, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { limitWord } from 'core/helpers/string';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { Item } from 'models/Item';
import { KpiItem } from 'models/kpi/KpiItem';
import { KpiItemContent } from 'models/kpi/KpiItemContent';
import { KpiItemContentFilter } from 'models/kpi/KpiItemContentFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { kpiItemService } from '../KpiItemService';
import './KpiItemPreview.scss';
export interface KpiItemPreviewIProps {
  model: KpiItem;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading?: boolean;
}

export default function KpiItemPreview(props: KpiItemPreviewIProps) {
  const { model, previewVisible, onClose, previewLoading, loading } = props;
  const [translate] = useTranslation();
  const [changeContent, setChangeContent] = React.useState<boolean>(true);
  const [, setModel] = React.useState<KpiItem>(model);
  const [kpiItemContentFilter, setKpiItemContentFilter] = React.useState<
    KpiItemContentFilter
  >(new KpiItemContentFilter());

  React.useEffect(() => {
    if (previewVisible) {
      setChangeContent(true);
    }
  }, [previewVisible]);

  const [kpiItemContents, setKpiItemContents] = crudService.useContentTable<
    KpiItem,
    KpiItemContent
  >(model, setModel, nameof(model.kpiItemContents));

  const [newContents] = kpiItemService.useKpiContentTable(
    changeContent,
    setChangeContent,
    kpiItemContents,
    setKpiItemContents,
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(
    newContents,
    kpiItemContentFilter,
    setKpiItemContentFilter,
  );

  const columns: ColumnProps<KpiItemContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<KpiItemContent>(),
      },
      {
        title: translate('kpiItemContents.itemCode'),
        key: nameof(dataSource[0].item.code),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.code;
        },
      },
      {
        title: translate('kpiItemContents.itemName'),
        key: nameof(dataSource[0].item.name),
        dataIndex: nameof(dataSource[0].item),
        render(item: Item) {
          return item?.name;
        },
      },
      {
        title: translate('kpiItemContents.indirectRevenue'),
        key: nameof(dataSource[0].indirectRevenue),
        dataIndex: nameof(dataSource[0].indirectRevenue),
        align: 'right',
        render(...[indirectRevenue]) {
          return formatNumber(indirectRevenue);
        },
      },

      {
        title: translate('kpiItemContents.indirectStore'),
        key: nameof(dataSource[0].indirectStore),
        dataIndex: nameof(dataSource[0].indirectStore),
        align: 'right',
        render(...[indirectStore]) {
          return formatNumber(indirectStore);
        },
      },
    ],
    [dataSource, translate],
  );
  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={
        translate('kpiItems.titlePreview') + ` ${model?.employee?.displayName}`
      }
      code={model?.employee?.username}
      statusId={model?.statusId}
    >
      <Spin spinning={previewLoading}>
        <Descriptions column={4}>
          <Descriptions.Item label={translate('kpiItems.organization')}>
            {model?.organization && (
              <Tooltip title={model?.organization?.name}>
                {limitWord(model?.organization?.name, 40)}
              </Tooltip>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={translate('kpiItems.kpiItemType')}>
            {model?.kpiItemType && model?.kpiItemType?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('kpiItems.kpiPeriod')}>
            {model?.kpiPeriod && model?.kpiPeriod?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('kpiItems.kpiYear')}>
            {model?.kpiYear && model?.kpiYear?.name}
          </Descriptions.Item>
        </Descriptions>
        <div className="title-kpi pt-2 mb-2">
          {translate('kpiItems.detail.kpiItem')}
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(model.id)}
          pagination={pagination}
          onChange={handleTableChange}
          className="mt-3 ml-1"
        />
      </Spin>
    </MasterPreview>
  );
}
