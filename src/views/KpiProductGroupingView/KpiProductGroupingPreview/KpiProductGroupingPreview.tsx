import { Descriptions, Spin, Tooltip } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { limitWord } from 'core/helpers/string';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { KpiProductGrouping } from 'models/kpi/KpiProductGrouping';
import { KpiProductGroupingContent } from 'models/kpi/KpiProductGroupingContent';
import { KpiProductGroupingContentFilter } from 'models/kpi/KpiProductGroupingContentFilter';
import { KpiProductGroupingContentItemMapping } from 'models/kpi/KpiProductGroupingContentItemMapping';
import { ProductGrouping } from 'models/ProductGrouping';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { kpiItemService } from '../KpiProductGroupingService';
import './KpiItemPreview.scss';
export interface KpiItemPreviewIProps {
  model: KpiProductGrouping;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading?: boolean;
}

export default function KpiItemPreview(props: KpiItemPreviewIProps) {
  const { model, previewVisible, onClose, previewLoading, loading } = props;
  const [translate] = useTranslation();
  const [changeContent, setChangeContent] = React.useState<boolean>(true);
  const [, setModel] = React.useState<KpiProductGrouping>(model);
  const [kpiItemContentFilter, setKpiItemContentFilter] = React.useState<
    KpiProductGroupingContentFilter
  >(new KpiProductGroupingContentFilter());

  React.useEffect(() => {
    if (previewVisible) {
      setChangeContent(true);
    }
  }, [previewVisible]);

  const [kpiItemContents, setKpiItemContents] = crudService.useContentTable<
    KpiProductGrouping,
    KpiProductGroupingContent
  >(model, setModel, nameof(model.kpiProductGroupingContents));

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

  const columns: ColumnProps<KpiProductGroupingContent>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<KpiProductGroupingContent>(),
      },
      {
        title: translate('kpiProductGroupingContents.productGroupingName'),
        key: nameof(dataSource[0].productGrouping.name),
        dataIndex: nameof(dataSource[0].productGrouping),
        render(productGrouping: ProductGrouping) {
          return productGrouping?.name;
        },
      },
      {
        title: translate('kpiProductGroupingContents.itemQuantity'),
        key: nameof(dataSource[0].kpiProductGroupingContentItemMappings),
        dataIndex: nameof(dataSource[0].kpiProductGroupingContentItemMappings),
        align: 'right',
        render(
          kpiProductGroupingContentItemMappings: KpiProductGroupingContentItemMapping[],
        ) {
          return formatNumber(kpiProductGroupingContentItemMappings.length);
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
        translate('kpiProductGroupings.titlePreview') +
        ` ${model?.employee?.displayName}`
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
            {model?.kpiProductGroupingType &&
              model?.kpiProductGroupingType?.name}
          </Descriptions.Item>
          <Descriptions.Item label={translate('kpiItems.kpiPeriod')}>
            {model?.kpiPeriod && model?.kpiPeriod?.name}
          </Descriptions.Item>

          <Descriptions.Item label={translate('kpiItems.kpiYear')}>
            {model?.kpiYear && model?.kpiYear?.name}
          </Descriptions.Item>
        </Descriptions>
        <div className="title-kpi pt-2 mb-2">
          {translate('kpiProductGroupings.detail.kpiProductGrouping')}
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
