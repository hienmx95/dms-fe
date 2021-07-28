import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { UNIT_OF_MEASURE_GROUPING_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import UnitOfMeasureGroupingPreview from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingMaster/UnitOfMeasureGroupingPreview';
import { unitOfMeasureGroupingRepository } from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingRepository';
import './UnitOfMeasureGroupingMaster.scss';
import { API_UNIT_OF_MEASURE_GROUPING_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

function UnitOfMeasureGroupingMaster() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'unit-of-measure-grouping',
    API_UNIT_OF_MEASURE_GROUPING_ROUTE,
    'mdm',
  );

  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
    ,
    resetSelect,
    setResetSelect,
    setPreviewModel,
  ] = crudService.useMaster<UnitOfMeasureGrouping, UnitOfMeasureGroupingFilter>(
    UnitOfMeasureGrouping,
    UnitOfMeasureGroupingFilter,
    unitOfMeasureGroupingRepository.count,
    unitOfMeasureGroupingRepository.list,
    unitOfMeasureGroupingRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    UNIT_OF_MEASURE_GROUPING_DETAIL_ROUTE,
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
  const [rowSelection, hasSelected] = tableService.useRowSelection<
    UnitOfMeasureGrouping
  >([], undefined, resetSelect, setResetSelect);

  const [handleDelete] = tableService.useDeleteHandler<UnitOfMeasureGrouping>(
    unitOfMeasureGroupingRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    unitOfMeasureGroupingRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [unitOfMeasureFilter, setUnitOfMeasureFilter] = React.useState<
    UnitOfMeasureFilter
  >(new UnitOfMeasureFilter());

  const columns: ColumnProps<UnitOfMeasureGrouping>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<UnitOfMeasureGrouping>(pagination),
        },

        {
          title: translate('unitOfMeasureGroupings.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<UnitOfMeasureGrouping>(
            nameof(list[0].code),
            sorter,
          ),
          render(...[, unitOfMeasureGrouping]) {
            return (
              <div
                className="display-code"
                onClick={handleOpenPreview(unitOfMeasureGrouping.id)}
              >
                {unitOfMeasureGrouping.code}
              </div>
            );
          },
        },
        {
          title: translate('unitOfMeasureGroupings.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<UnitOfMeasureGrouping>(
            nameof(list[0].name),
            sorter,
          ),
        },
        {
          title: translate('unitOfMeasureGroupings.unit'),
          key: nameof(list[0].unitOfMeasure),
          dataIndex: nameof(list[0].unitOfMeasure),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<UnitOfMeasureGrouping>(
            nameof(list[0].unitOfMeasure),
            sorter,
          ),
          render(unitOfMeasure: UnitOfMeasure) {
            return unitOfMeasure?.name;
          },
        },
        {
          title: translate('unitOfMeasureGroupings.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          sortOrder: getOrderTypeForTable<UnitOfMeasureGrouping>(
            nameof(list[0].status),
            sorter,
          ),
          align: 'center',
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, unitOfMeasureGrouping: UnitOfMeasureGrouping) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') && (
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                )}
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

                {!unitOfMeasureGrouping.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(unitOfMeasureGrouping)}
                    >
                      <i className="tio-delete_outlined" />
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
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('unitOfMeasureGroupings.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('unitOfMeasureGroupings.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.code',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('unitOfMeasureGroupings.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(previewModel.id))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate(
                      'unitOfMeasureGroupings.placeholder.name',
                    )}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('filterListUnitOfMeasure') && (
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('unitOfMeasureGroupings.unit')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.unitOfMeasureId}
                      filterType={nameof(filter.unitOfMeasureId.equal)}
                      value={filter.unitOfMeasureId.equal}
                      onChange={handleFilter(nameof(filter.unitOfMeasureId))}
                      getList={
                        unitOfMeasureGroupingRepository.filterListUnitOfMeasure
                      }
                      modelFilter={unitOfMeasureFilter}
                      setModelFilter={setUnitOfMeasureFilter}
                      searchField={nameof(unitOfMeasureFilter.name)}
                      searchType={nameof(unitOfMeasureFilter.name.contain)}
                      placeholder={translate(
                        'unitOfMeasureGroupings.placeholder.unitOfMeasure',
                      )}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              )}
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
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') && (
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  )}
                  {validAction('bulkDelete') && (
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  )}
                </div>
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
        {/* <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
        /> */}
        <UnitOfMeasureGroupingPreview
          setPreviewModel={setPreviewModel}
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />
      </Card>
    </div>
  );
}

export default UnitOfMeasureGroupingMaster;
