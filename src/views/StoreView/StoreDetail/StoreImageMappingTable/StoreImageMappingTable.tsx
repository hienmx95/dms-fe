import React from 'react';
import { ContentTableProps } from 'react3l';
import { crudService, formService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { tableService } from 'services';
import { getOrderTypeForTable, renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import Form from 'antd/lib/form';
import { formItemLayout } from 'config/ant-design/form';
import { Col, Row } from 'antd/lib/grid';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';

import { storeRepository } from 'views/StoreView/StoreRepository';
import { Store } from 'models/Store';
import { StoreImageMapping } from 'models/StoreImageMapping';
import { StoreImageMappingFilter } from 'models/StoreImageMappingFilter';
import StoreImageMappingModal from 'views/StoreView/StoreDetail/StoreImageMappingModal/StoreImageMappingModal';

const { Item: FormItem } = Form;

function StoreImageMappingTable(props: ContentTableProps<Store, StoreImageMapping>) {
  const [translate] = useTranslation();

  const {
    model,
    setModel,
  } = props;

  const [
    storeImageMappings,
    setStoreImageMappings,
    handleAdd,
    handleDelete,
  ] = crudService.useContentTable<Store, StoreImageMapping>(
    model,
    setModel,
    nameof(model.storeImageMappings),
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    storeImageMappingFilter,
    setStoreImageMappingFilter,
  ] = crudService.useContentModal(
    storeRepository.listStoreImageMapping,
    storeRepository.countStoreImageMapping,
    StoreImageMappingFilter,
  );

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(
    storeImageMappings,
    storeImageMappingFilter,
    setStoreImageMappingFilter,
  );

  const columns: ColumnProps<StoreImageMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<StoreImageMapping>(pagination),
      },
      {
        title: translate('storeImageMappings.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<StoreImageMapping>(pagination),
      },
      {
        title: translate('storeImageMappings.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Store>(nameof(dataSource[0].name), sorter),
        render(name: string, storeImageMapping: StoreImageMapping) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<StoreImageMapping>(storeImageMapping.errors, nameof(storeImageMapping.name))}
              help={storeImageMapping.errors?.name}
            >
              <input type="text"
                className="form-control form-control-sm"
                name={nameof(name)}
                defaultValue={name}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...params: [StoreImageMapping, StoreImageMapping, number]) {
          return (
            <>
              <button className="btn btn-link mr-2" onClick={handleDelete(params[2])}>
                <i className="fa fa-trash" />
              </button>
            </>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, sorter, translate],
  );
  const tableTitle = React.useCallback(
    () => (
      <button className="btn btn-sm btn-primary" onClick={handleOpen}>
        <i className="fa fa-plus mr-2" />
        {translate(generalLanguageKeys.actions.add)}
      </button>
    ),
    [handleOpen, translate],
  );
  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAdd}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAdd, translate],
  );

  return (
    <>
      <CollapsibleCard title={translate(generalLanguageKeys.actions.search)} className="mb-4">
        <StoreImageMappingModal title={translate('store.storeImageMappingModal.title')}
          selectedList={storeImageMappings}
          setSelectedList={setStoreImageMappings}
          list={list}
          total={total}
          isOpen={visible}
          loading={loading}
          toggle={handleClose}
          onClose={handleClose}
          filter={storeImageMappingFilter}
          setFilter={setStoreImageMappingFilter}
        />
        <Form {...formItemLayout}>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('stores.id')}>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-end mt-2">
          <button className="btn btn-sm btn-primary mr-2" onClick={handleSearch}>
            <i className="fa fa-search mr-2" />
            {translate(generalLanguageKeys.actions.filter)}
          </button>
          <button className="btn btn-sm btn-outline-primary text-dark" onClick={handleReset}>
            <i className="fa mr-2 fa-times" />
            {translate(generalLanguageKeys.actions.reset)}
          </button>
        </div>
      </CollapsibleCard>
      <Table pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        bordered={true}
        size="small"
        title={tableTitle}
        footer={tableFooter}
      />
    </>
  );
}

export default StoreImageMappingTable;
