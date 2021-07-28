import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_PROBLEM_TYPE_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { StatusFilter } from 'models/StatusFilter';
import { StoreScoutingType } from 'models/StoreScoutingType';
import { StoreScoutingTypeFilter } from 'models/StoreScoutingTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import StoreScoutingTypeDetail from '../StoreScoutingTypeDetail/StoreScoutingTypeDetail';
import { storeScoutingTypeRepository } from '../StoreScoutingTypeRepository';
import './StoreScoutingTypeMaster.scss';
import StoreScoutingTypePreview from './StoreScoutingTypePreview';

const { Item: FormItem } = Form;

function StoreScoutingTypeMaster() {
  const [translate] = useTranslation();

  const { validAction } = crudService.useAction(
    'problem-type',
    API_PROBLEM_TYPE_ROUTE,
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
    setLoadList,
    resetSelect,
    setResetSelect,
  ] = crudService.useMaster<StoreScoutingType, StoreScoutingTypeFilter>(
    StoreScoutingType,
    StoreScoutingTypeFilter,
    storeScoutingTypeRepository.count,
    storeScoutingTypeRepository.list,
    storeScoutingTypeRepository.get,
  );

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
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
    StoreScoutingType
  >([], undefined, resetSelect, setResetSelect);

  const [handleDelete] = tableService.useDeleteHandler<StoreScoutingType>(
    storeScoutingTypeRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    storeScoutingTypeRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );

  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleGoDetail = React.useCallback(
    (storeScoutingType: StoreScoutingType) => {
      setCurrentItem(storeScoutingType);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const columns: ColumnProps<StoreScoutingType>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<StoreScoutingType>(pagination),
        },
        {
          title: translate('storeScoutingTypes.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          align: 'center',
          sortOrder: getOrderTypeForTable<StoreScoutingType>(
            nameof(list[0].code),
            sorter,
          ),
        },

        {
          title: translate('storeScoutingTypes.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          align: 'center',
          sortOrder: getOrderTypeForTable<StoreScoutingType>(
            nameof(list[0].name),
            sorter,
          ),
        },
        {
          title: translate('storeScoutingTypes.status'),
          key: nameof(list[0].statusId),
          dataIndex: nameof(list[0].statusId),
          sorter: true,
          sortOrder: getOrderTypeForTable<StoreScoutingType>(
            nameof(list[0].statusId),
            sorter,
          ),
          align: 'center',
          render(...[statusId]) {
            return (
              <div className={statusId === 1 ? 'active' : ''}>
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
          render(id: number, storeScoutingType: StoreScoutingType) {
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
                      onClick={() => handleGoDetail(storeScoutingType)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                )}

                {!storeScoutingType.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(storeScoutingType)}
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
  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);
  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <div className="page master-page">
      <Card title={translate('storeScoutingTypes.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3" // sua cho nay
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              {/* cho nay thay thanh span 6 nha */}
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('storeScoutingTypes.code')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    className="w-100"
                    placeholder={translate(
                      'storeScoutingTypes.placeholder.code',
                    )}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  labelAlign="left"
                  className="mb-1"
                  label={translate('storeScoutingTypes.name')}
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(previewModel.name))}
                    className="w-100"
                    placeholder={translate(
                      'storeScoutingTypes.placeholder.name',
                    )}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStatus') && (
                <Col className="pl-1" span={6}>
                  <Form.Item
                    labelAlign="left"
                    className="mb-1"
                    label={translate('storeScoutingTypes.status')}
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={storeScoutingTypeRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      placeholder={translate('general.placeholder.title')}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
          {/* sua cho nay */}
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
                      onClick={handleCreate}
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
        <StoreScoutingTypePreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />
      </Card>
      {visible === true && (
        <StoreScoutingTypeDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListStoreScoutingType={storeScoutingTypeRepository.list}
          setListStoreScoutingType={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default StoreScoutingTypeMaster;
