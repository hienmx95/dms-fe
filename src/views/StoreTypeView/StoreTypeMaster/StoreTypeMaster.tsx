import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Status } from 'models/Status';
import { StoreType } from 'models/StoreType';
import { StoreTypeFilter } from 'models/StoreTypeFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { storeTypeRepository } from 'views/StoreTypeView/StoreTypeRepository';
import { StoreTypeDetail } from '../StoreTypeView';
import './StoreTypeMaster.scss';
import { Tooltip } from 'antd';
import StoreTypePreview from 'views/StoreTypeView/StoreTypeMaster/StoreTypePreview';
import { API_STORE_TYPE_ROUTE } from 'config/api-consts';
import { Color } from 'models/Color';

const { Item: FormItem } = Form;

function StoreTypeMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('store-type', API_STORE_TYPE_ROUTE);


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
  ] = crudService.useMaster<StoreType, StoreTypeFilter>(
    StoreType,
    StoreTypeFilter,
    storeTypeRepository.count,
    storeTypeRepository.list,
    storeTypeRepository.get,
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
  const [rowSelection, hasSelected] = tableService.useRowSelection<StoreType>([], undefined, resetSelect, setResetSelect);

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<StoreType>(
    storeTypeRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    storeTypeRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleGoDetail = React.useCallback(
    (storeType: StoreType) => {
      setCurrentItem(storeType);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const columns: ColumnProps<StoreType>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<StoreType>(pagination),
        },

        {
          title: translate('storeTypes.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<StoreType>(
            nameof(list[0].code),
            sorter,
          ),
        },

        {
          title: translate('storeTypes.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<StoreType>(
            nameof(list[0].name),
            sorter,
          ),
        },
        {
          title: translate('storeTypes.color'),
          key: nameof(list[0].color),
          dataIndex: nameof(list[0].color),

          ellipsis: true,

          render(color: Color) {
            if (color?.id !== undefined) {

              return <div className=" form-color">
                <div className="color mr-4" style={{ backgroundColor: `${color?.code}`, border: `1px solid #e8e8e8` }} />
                <div>{color?.name}</div>
              </div>;
            }
            else return null;
          },
        },
        {
          title: translate('storeTypes.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<StoreType>(
            nameof(list[0].status),
            sorter,
          ),
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
          render(id: number, storeType: StoreType) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('update') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)} >
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoDetail(storeType)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!storeType.used && validAction('delete') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(storeType)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                }
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
      <Card title={translate('storeTypes.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeTypes.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(previewModel.code))}
                    placeholder={translate('storeTypes.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('storeTypes.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(previewModel.name))}
                    placeholder={translate('storeTypes.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') &&
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
            }
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
                  {validAction('create') &&
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  }
                  {validAction('bulkDelete') &&
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                  }
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
        <StoreTypePreview
          previewModel={previewModel}
          previewLoading={previewLoading}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
        />
      </Card>
      <StoreTypeDetail
        isDetail={isDetail}
        visible={visible}
        setVisible={setVisible}
        getListStore={storeTypeRepository.list}
        setListStore={setList}
        currentItem={currentItem}
        onClose={handlePopupCancel}
        setLoadList={setLoadList}
      />
    </div>
  );
}

export default StoreTypeMaster;
