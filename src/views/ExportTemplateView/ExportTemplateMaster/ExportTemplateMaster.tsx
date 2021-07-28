import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_EXPORT_TEMPLATE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { EXPORT_TEMPLATE_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { ExportTemplate } from 'models/ExportTemplate';
import { ExportTemplateFilter } from 'models/ExportTemplateFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { exportTemplateRepository } from 'views/ExportTemplateView/ExportTemplateRepository';

const { Item: FormItem } = Form;

function ExportTemplateMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'export-template',
    API_EXPORT_TEMPLATE_ROUTE,
  );

  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    ,
    total,
    ,
    ,
    ,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    ,
    ,
    handleDefaultSearch,
  ] = crudService.useMaster<ExportTemplate, ExportTemplateFilter>(
    ExportTemplate,
    ExportTemplateFilter,
    exportTemplateRepository.count,
    exportTemplateRepository.list,
    exportTemplateRepository.get,
  );

  const [, handleGoDetail] = routerService.useMasterNavigation(
    EXPORT_TEMPLATE_DETAIL_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  /**
   * rowSelection, hasSelectedAll
   */

  const columns: ColumnProps<ExportTemplate>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<ExportTemplate>(pagination),
        },
        {
          title: translate('exportTemplates.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<ExportTemplate>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('exportTemplates.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<ExportTemplate>(
            nameof(list[0].name),
            sorter,
          ),
          ellipsis: true,
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('update') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [handleGoDetail, list, pagination, sorter, translate, validAction],
  );

  return (
    <div className="page master-page">
      <Card title={translate('exportTemplates.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('exportTemplates.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('exportTemplates.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('exportTemplates.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('exportTemplates.placeholder.name')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') && (
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleReset}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            )}
          </div>
        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          key={list[0]?.id}
          rowKey={nameof(list[0].id)}
          pagination={pagination}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-end">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
      </Card>
    </div>
  );
}

export default ExportTemplateMaster;
