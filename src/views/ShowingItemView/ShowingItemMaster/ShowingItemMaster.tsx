import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_SHOWING_ITEM_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { SHOWING_ITEM_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { formatNumber } from 'helpers/number-format';
import { Category, CategoryFilter } from 'models/Category';
import { ShowingItem } from 'models/posm/ShowingItem';
import { ShowingItemFilter } from 'models/posm/ShowingItemFilter';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import ShowingItemPreview from 'views/ShowingItemView/ShowingItemMaster/ShowingItemPreview';
import { showingItemRepository } from 'views/ShowingItemView/ShowingItemRepository';
import './ShowingItemMaster.scss';

const { Item: FormItem } = Form;

function ShowingItemMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'showing-item',
    API_SHOWING_ITEM_ROUTE,
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
  ] = crudService.useMaster<ShowingItem, ShowingItemFilter>(
    ShowingItem,
    ShowingItemFilter,
    showingItemRepository.count,
    showingItemRepository.list,
    showingItemRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    SHOWING_ITEM_DETAIL_ROUTE,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [rowSelection, hasSelected] = tableService.useRowSelection<ShowingItem>(
    [],
    undefined,
    resetSelect,
    setResetSelect,
  );

  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = crudService.useImport(showingItemRepository.import, setLoading);

  const [handleExport] = crudService.useExport(
    showingItemRepository.export,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    showingItemRepository.exportTemplate,
    filter,
  );

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );

  const [categoryFilter, setCategoryFilter] = React.useState<CategoryFilter>(
    new CategoryFilter(),
  );

  const [handleDelete] = tableService.useDeleteHandler<ShowingItem>(
    showingItemRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    showingItemRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const columns: ColumnProps<ShowingItem>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<ShowingItem>(pagination),
      },
      {
        title: translate('showingItems.code'),
        key: nameof(list[0].code),
        dataIndex: nameof(list[0].code),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ShowingItem>(
          nameof(list[0].code),
          sorter,
        ),
      },
      {
        title: translate('showingItems.name'),
        key: nameof(list[0].name),
        dataIndex: nameof(list[0].name),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ShowingItem>(
          nameof(list[0].name),
          sorter,
        ),
      },
      {
        title: translate('showingItems.unitOfMeasure'),
        key: nameof(list[0].unitOfMeasure),
        dataIndex: nameof(list[0].unitOfMeasure),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ShowingItem>(
          nameof(list[0].unitOfMeasure),
          sorter,
        ),
        render(unitOfMeasure: UnitOfMeasure) {
          return <div className="text-left">{unitOfMeasure?.name}</div>;
        },
      },

      {
        title: translate('showingItems.category'),
        key: nameof(list[0].showingCategory),
        dataIndex: nameof(list[0].showingCategory),
        sorter: true,
        ellipsis: true,
        sortOrder: getOrderTypeForTable<ShowingItem>(
          nameof(list[0].showingCategoryId),
          sorter,
        ),
        render(showingCategory: Category) {
          return <div className="text-left">{showingCategory?.name}</div>;
        },
      },

      {
        title: translate('showingItems.salePrice'),
        key: nameof(list[0].salePrice),
        dataIndex: nameof(list[0].salePrice),
        sorter: true,
        ellipsis: true,
        align: 'right',
        sortOrder: getOrderTypeForTable<ShowingItem>(
          nameof(list[0].salePrice),
          sorter,
        ),
        render(salePrice: number) {
          return formatNumber(salePrice);
        },
      },

      {
        title: translate('showingItems.status'),
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        align: 'center',
        sorter: true,
        sortOrder: getOrderTypeForTable<Status>(nameof(list[0].status), sorter),
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
        render(id: number, showingItem: ShowingItem) {
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

              {!showingItem.used && validAction('delete') && (
                <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={handleDelete(showingItem)}
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
  }, [
    handleDelete,
    handleGoDetail,
    handleOpenPreview,
    list,
    pagination,
    sorter,
    translate,
    validAction,
  ]);

  return (
    <div className="page master-page">
      <Card
        title={translate('showingItems.master.title')}
        className="header-title"
      >
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingItems.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    className="w-100"
                    placeholder={translate('showingItems.placeholder.code')}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingItems.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('showingItems.placeholder.name')}
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('showingItems.category')}
                >
                  <AdvancedTreeFilter
                    filter={filter.showingCategoryId}
                    filterType={nameof(filter.showingCategoryId.equal)}
                    value={filter.showingCategoryId.equal}
                    onChange={handleFilter(nameof(filter.showingCategoryId))}
                    getList={showingItemRepository.filterListShowingCategory}
                    modelFilter={categoryFilter}
                    setModelFilter={setCategoryFilter}
                    allowClear={true}
                    placeholder={translate('general.placeholder.title')}
                    mode="single"
                  />
                </FormItem>
              </Col>

              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingItems.salePrice')}
                  labelAlign="left"
                >
                  <div className="d-flex">
                    <AdvancedNumberFilter
                      filterType={nameof(filter.salePrice.range)}
                      filter={filter.salePrice}
                      onChange={handleFilter(nameof(filter.salePrice))}
                      className="w-100"
                    />
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('showingItems.status')}
                  labelAlign="left"
                >
                  <AdvancedIdFilter
                    filter={filter.statusId}
                    filterType={nameof(filter.statusId.equal)}
                    value={filter.statusId.equal}
                    onChange={handleFilter(nameof(filter.statusId))}
                    getList={showingItemRepository.filterListStatus}
                    modelFilter={statusFilter}
                    setModelFilter={setStatusFilter}
                    searchField={nameof(statusFilter.name)}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('general.placeholder.title')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
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
                  {/* create button */}
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleGoCreate}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate(generalLanguageKeys.actions.create)}
                  </button>
                  {/* bulk delete button */}
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!hasSelected}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button>

                  <label
                    className="btn btn-sm btn-outline-primary mr-2 mb-0"
                    htmlFor="master-import"
                  >
                    <i className="tio-file_add_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                  <button
                    className="btn btn-sm btn-export-template mr-2"
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
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
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />
      </Card>

      <ShowingItemPreview
        previewModel={previewModel}
        previewLoading={previewLoading}
        previewVisible={previewVisible}
        onClose={handleClosePreview}
      />
      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </div>
  );
}

export default ShowingItemMaster;
