import { Descriptions, Spin, Tabs, Tooltip } from 'antd';
import MasterPreview from 'components/MasterPreview/MasterPreview';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Table, { ColumnProps } from 'antd/lib/table';
import nameof from 'ts-nameof.macro';
import { KpiGeneral } from 'models/kpi/KpiGeneral';
import { KpiGeneralContent } from 'models/kpi/KpiGeneralContent';
import { KpiCriteriaGeneral } from 'models/kpi/KpiCriteriaGeneral';
import { kpiGenralService } from 'views/KpiGeneralView/KpiGeneralService';
import { crudService, tableService } from 'core/services';
import { KpiGeneralContentFilter } from 'models/kpi/KpiGeneralContentFilter';
import './KpiGeneralPreview.scss';
import { formatNumber } from 'helpers/number-format';
import { limitWord } from 'core/helpers/string';

export interface KpiGeneralPreviewIProps {
  previewModel: KpiGeneral;
  previewVisible: boolean;
  onClose: () => void;
  previewLoading: boolean;
  loading: boolean;
}
// const { Item: FormItem } = Form;

const { TabPane } = Tabs;
export default function KpiGeneralPreview(props: KpiGeneralPreviewIProps) {
  const { previewModel, previewVisible, onClose, previewLoading, loading } = props;
  const [translate] = useTranslation();
  const [mode, setMode] = React.useState<number>(1);
  const [, setModel] = React.useState<KpiGeneral>(previewModel);
  const [kpiGeneralContentFilter, setKpiGeneralContentFilter] = React.useState<
    KpiGeneralContentFilter
  >(new KpiGeneralContentFilter());


  const [
    kpiGeneralContents,
    setKpiGeneralContents,
  ] = crudService.useContentTable<KpiGeneral, KpiGeneralContent>(
    previewModel,
    setModel,
    nameof(previewModel.kpiGeneralContents));



  const [newContents] = kpiGenralService.useKpiContentTable(
    kpiGeneralContents,
    setKpiGeneralContents,
  );

  // console.log('newContents: ', newContents)

  /* dateSource and table service */
  const [
    dataSource,
  ] = tableService.useLocalTable(
    newContents,
    kpiGeneralContentFilter,
    setKpiGeneralContentFilter,
  );
  const handleChangeMode = React.useCallback((mode: number) => {
    setMode(mode);
  }, [setMode]);
  const columns: ColumnProps<KpiGeneralContent>[] = React.useMemo(() => {
    if (mode === 1) {
      return [
        {
          title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
          key: nameof(dataSource[0].kpiCriteriaGeneral),
          dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
          render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
            return kpiCriteriaGeneral?.name;
          },
          width: 200,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: translate('kpiGeneralContents.jan'),
          key: nameof(dataSource[0].jan),
          dataIndex: nameof(dataSource[0].jan),
          align: 'right',
          render(...[jan]) {
            return formatNumber(jan);
          },
        },
        {
          title: translate('kpiGeneralContents.feb'),
          key: nameof(dataSource[0].feb),
          dataIndex: nameof(dataSource[0].feb),
          align: 'right',
          render(...[feb]) {
            return formatNumber(feb);
          },
        },
        {
          title: translate('kpiGeneralContents.mar'),
          key: nameof(dataSource[0].mar),
          dataIndex: nameof(dataSource[0].mar),
          align: 'right',
          render(...[mar]) {
            return formatNumber(mar);
          },
        },
        {
          title: translate('kpiGeneralContents.apr'),
          key: nameof(dataSource[0].apr),
          dataIndex: nameof(dataSource[0].apr),
          align: 'right',
          render(...[apr]) {
            return formatNumber(apr);
          },
        },
        {
          title: translate('kpiGeneralContents.may'),
          key: nameof(dataSource[0].may),
          dataIndex: nameof(dataSource[0].may),
          align: 'right',
          render(...[may]) {
            return formatNumber(may);
          },
        },
        {
          title: translate('kpiGeneralContents.jun'),
          key: nameof(dataSource[0].jun),
          dataIndex: nameof(dataSource[0].jun),
          align: 'right',
          render(...[jun]) {
            return formatNumber(jun);
          },
        },
        {
          title: translate('kpiGeneralContents.jul'),
          key: nameof(dataSource[0].jul),
          dataIndex: nameof(dataSource[0].jul),
          align: 'right',
          render(...[jul]) {
            return formatNumber(jul);
          },
        },
        {
          title: translate('kpiGeneralContents.aug'),
          key: nameof(dataSource[0].aug),
          dataIndex: nameof(dataSource[0].aug),
          align: 'right',
          render(...[aug]) {
            return formatNumber(aug);
          },
        },
        {
          title: translate('kpiGeneralContents.sep'),
          key: nameof(dataSource[0].sep),
          dataIndex: nameof(dataSource[0].sep),
          align: 'right',
          render(...[sep]) {
            return formatNumber(sep);
          },
        },
        {
          title: translate('kpiGeneralContents.oct'),
          key: nameof(dataSource[0].oct),
          dataIndex: nameof(dataSource[0].oct),
          align: 'right',
          render(...[oct]) {
            return formatNumber(oct);
          },
        },
        {
          title: translate('kpiGeneralContents.nov'),
          key: nameof(dataSource[0].nov),
          dataIndex: nameof(dataSource[0].nov),
          align: 'right',
          render(...[nov]) {
            return formatNumber(nov);
          },
        },
        {
          title: translate('kpiGeneralContents.dec'),
          key: nameof(dataSource[0].dec),
          dataIndex: nameof(dataSource[0].dec),
          align: 'right',
          render(...[dec]) {
            return formatNumber(dec);
          },
        },
      ];
    } else if (mode === 2) {
      return [
        {
          title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
          key: nameof(dataSource[0].kpiCriteriaGeneral),
          dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
          render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
            return kpiCriteriaGeneral?.name;
          },
          width: 200,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: translate('kpiGeneralContents.q1'),
          key: nameof(dataSource[0].q1),
          dataIndex: nameof(dataSource[0].q1),
          align: 'right',
          render(...[q1]) {
            return formatNumber(q1);
          },
        },
        {
          title: translate('kpiGeneralContents.q2'),
          key: nameof(dataSource[0].q2),
          dataIndex: nameof(dataSource[0].q2),
          align: 'right',
          render(...[q2]) {
            return formatNumber(q2);
          },
        },
        {
          title: translate('kpiGeneralContents.q3'),
          key: nameof(dataSource[0].q3),
          dataIndex: nameof(dataSource[0].q3),
          align: 'right',
          render(...[q3]) {
            return formatNumber(q3);
          },
        },
        {
          title: translate('kpiGeneralContents.q4'),
          key: nameof(dataSource[0].q4),
          dataIndex: nameof(dataSource[0].q4),
          align: 'right',
          render(...[q4]) {
            return formatNumber(q4);
          },
        },
      ];
    } else if (mode === 3) {
      return [
        {
          title: translate('kpiGeneralContents.kpiCriteriaGeneral'),
          key: nameof(dataSource[0].kpiCriteriaGeneral),
          dataIndex: nameof(dataSource[0].kpiCriteriaGeneral),
          render(kpiCriteriaGeneral: KpiCriteriaGeneral) {
            return kpiCriteriaGeneral?.name;
          },
          width: 100,
          ellipsis: true,
          fixed: 'left',
        },
        {
          title: translate('kpiGeneralContents.year'),
          key: nameof(dataSource[0].year),
          dataIndex: nameof(dataSource[0].year),
          align: 'right',
          width: 50,
          render(...[year]) {
            return formatNumber(year);
          },
        },
      ];
    }
  }, [dataSource, mode, translate]);

  return (
    <MasterPreview
      isOpen={previewVisible}
      onClose={onClose}
      size="xl"
      title={translate('kpiGeneralContents.preview.title') + ` ${previewModel?.employee?.username}`}
      code={previewModel?.employee?.displayName}
      statusId={previewModel.statusId}
      className="kpi-general-preview"
    >
      <Spin spinning={previewLoading}>

        <Descriptions column={3}>
          <Descriptions.Item label={translate('kpiGenerals.organization')}>
            {previewModel?.organization &&
              <Tooltip title={previewModel?.organization?.name}>
                {limitWord(previewModel?.organization?.name, 40)}
              </Tooltip>
            }
          </Descriptions.Item>
          <Descriptions.Item label={translate('kpiGenerals.kpiYear')}>
            {previewModel?.kpiYear?.name}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions
          title={translate('kpiGenerals.preview.kpiCriteriaGeneral')}
          column={1}
        >
          <Descriptions.Item className="table-criteria-general">
            <Tabs defaultActiveKey="1" className="mr-3 ">
              <TabPane
                key="2"
                className="tab-month"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleChangeMode(1)}>
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.month')}
                    </button>
                  </>
                }

              >
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  size="small"
                  tableLayout="fixed"
                  loading={loading}
                  rowKey={nameof(previewModel.id)}
                  pagination={false}
                  className="table-kpi"
                />
              </TabPane>
              <TabPane
                key="3"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleChangeMode(2)}>
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.quarter')}
                    </button>
                  </>
                }
              >
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  size="small"
                  tableLayout="fixed"
                  loading={loading}
                  rowKey={nameof(previewModel.id)}
                  pagination={false}
                  className="table-kpi"
                />
              </TabPane>
              <TabPane
                key="4"
                tab={
                  <>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleChangeMode(3)}>
                      <i className="tio mr-2 tio-layers" />
                      {translate('kpiGenerals.tabs.year')}
                    </button>
                  </>
                }
              >
                <Table
                  className="table-kpi"
                  dataSource={dataSource}
                  columns={columns}
                  size="small"
                  tableLayout="fixed"
                  loading={loading}
                  rowKey={nameof(previewModel.id)}
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </MasterPreview>
  );
}
