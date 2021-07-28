import { Modal, Popconfirm } from 'antd';
import Form from 'antd/lib/form';
import Table, { ColumnProps, TableRowSelection } from 'antd/lib/table';

import { API_SHOWING_ORDER_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';

import { ShowingOrder } from 'models/posm/ShowingOrder';
import { Store } from 'models/Store';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { showingOrderService } from '../../ShowingOrderService';

import '../ShowingOrderContentTable/ShowingOrderContentTable.scss';
import { StoreFilter } from 'models/StoreFilter';
import StoreModal from '../StoreModal';
import { showingOrderRepository } from '../../ShowingOrderRepository';
import { storeRepository } from '../../../../StoreView/StoreRepository';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { ContentTableProps } from 'react3l';
const { Item: FormItem } = Form;

export interface ShowingOrderContentTableProps
  extends ContentTableProps<ShowingOrder, Store> {
  isDetail?: boolean;
}

function ShowingListStoreTable(props: ShowingOrderContentTableProps) {
  const [translate] = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { validAction } = crudService.useAction(
    'showing-order',
    API_SHOWING_ORDER_ROUTE,
  );
  const { model, setModel, isDetail } = props;

  const [stores, setStores] = crudService.useContentTable<ShowingOrder, Store>(
    model,
    setModel,
    nameof(model.stores),
  );

  const [showingStoreFilter, setStoreFilter] = React.useState<StoreFilter>(
    new StoreFilter(),
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable(stores, showingStoreFilter, setStoreFilter);

  const [selectedContents, setSelectedContents] = React.useState<Store[]>([]);

  const rowSelection: TableRowSelection<Store> = crudService.useContentModalList<
    Store
  >(selectedContents, setSelectedContents);

  const {
    loadList,
    setLoadList,
    isOpen,
    setIsOpen,
    selectedList,
    setSelectedList,
    handleCloseStoreModal,
    filterStore,
    setFilterStore,
  } = showingOrderService.useModal(StoreFilter);

  const handleOpenStoreModal = React.useCallback(() => {
    if (typeof model.organizationId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('stores.errors.organizationId'),
      });
    } else {
      if (stores?.length > 0) {
        setSelectedList([...stores]);
      }

      setIsOpen(true);
      setLoadList(true);
      filterStore.organizationId.equal = model?.organization?.id;
      setFilterStore({ ...filterStore });
    }
  }, [
    filterStore,
    setFilterStore,
    setIsOpen,
    setLoadList,
    setSelectedList,
    stores,
    translate,
    model,
  ]);

  const handleSaveStore = React.useCallback(
    list => {
      if (list && list.length > 0) {
        model.stores = list;

        setStores([...list]);
        setModel({ ...model });
      }

      setIsOpen(false);
    },
    [setIsOpen, setStores, model, setModel],
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        stores.splice(index, 1);
        setStores([...stores]);
        setSelectedList([...stores]);
      };
    },
    [stores, setStores, setSelectedList],
  );

  const handleBulkDelete = React.useCallback(() => {
    Modal.confirm({
      title: translate(generalLanguageKeys.delete.title),
      content: translate(generalLanguageKeys.delete.content),

      onOk() {
        if (selectedContents && selectedContents.length > 0) {
          const selectedStoreIds = selectedContents.map(
            (content: Store) => content.id,
          );
          const remainContents = stores.filter((content: Store) => {
            if (selectedStoreIds.includes(content.id)) {
              return false;
            }
            return true;
          });
          setStores([...remainContents]);
          setSelectedList([...remainContents]);
          setSelectedContents([]);
        }
      },
    });
  }, [stores, selectedContents, setStores, translate, setSelectedList]);

  const [
    handleImport,
    importERouteContents,
    setImportERouteContents,
    errVisible,
    setErrVisible,
    errModel,
    inputRef,
  ] = showingOrderService.useImport(
    storeRepository.import,
    setLoading,
    showingStoreFilter,
  );
  const [handleExport] = showingOrderService.useExport(
    storeRepository.export,
    showingStoreFilter,
  );

  const [handleExportTemplate] = showingOrderService.useExport(
    storeRepository.exportTemplate,
    showingStoreFilter,
  );

  const handleExportTemplateStore = React.useCallback(() => {
    if (typeof model.organizationId === 'undefined') {
      Modal.warning({
        title: '',
        content: translate('stores.errors.organization'),
      });
    } else {
      handleExportTemplate();
    }

    // openModal
  }, [model, translate, handleExportTemplate]);

  React.useEffect(() => {
    if (importERouteContents && importERouteContents.length > 0) {
      setStores(importERouteContents);
      setImportERouteContents([]);
    }
  }, [importERouteContents, setImportERouteContents, setStores]);

  const columns: ColumnProps<Store>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Store>(pagination),
      },

      {
        title: translate('showingOrders.stores.codeDraft'),
        key: nameof(dataSource[0].code),
        dataIndex: nameof(dataSource[0].code),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.address'),
        key: nameof(dataSource[0].address),
        dataIndex: nameof(dataSource[0].address),
        ellipsis: true,
      },
      {
        title: translate('showingOrders.stores.telephone'),
        key: nameof(dataSource[0].telephone),
        dataIndex: nameof(dataSource[0].telephone),
        ellipsis: true,
      },

      {
        key: nameof(dataSource[0].storeType),
        dataIndex: nameof(dataSource[0].storeType),
        title: translate('showingOrders.stores.storeType'),
        render(storeType) {
          return storeType?.name;
        },
      },

      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        dataIndex: nameof(dataSource[0].id),
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="button-action-table">
              {validAction('create') && (
                <Popconfirm
                  placement="left"
                  title={translate('general.delete.content')}
                  onConfirm={handleDelete(index)}
                  okText={translate('general.actions.delete')}
                  cancelText={translate('general.actions.cancel')}
                >
                  <button className="btn btn-link mr-2">
                    <i className="tio-delete_outlined" />
                  </button>
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, translate, validAction],
  );

  return (
    <>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        size="small"
        rowSelection={rowSelection}
        className="table-content-item"
        scroll={{ y: 700 }}
        loading={loading}
        title={() => (
          <>
            <div className="d-flex justify-content-between button-table">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listStore') && (
                  <>
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleOpenStoreModal}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate('general.actions.addNew')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      onClick={handleBulkDelete}
                      disabled={!selectedContents.length}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
                    </button>
                    {
                      <label
                        className="btn btn-sm btn-outline-primary mr-2 mb-0"
                        htmlFor="master-import"
                      >
                        <i className="tio-file_add_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.import)}
                      </label>
                    }

                    {isDetail && (
                      <button
                        className="btn btn-sm btn-outline-primary mr-2"
                        onClick={handleExport}
                      >
                        <i className="tio-file_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.export)}
                      </button>
                    )}
                    {
                      <button
                        className="btn btn-sm btn-export-template mr-2"
                        onClick={handleExportTemplateStore}
                      >
                        <i className="tio-download_outlined mr-2" />
                        {translate(generalLanguageKeys.actions.exportTemplate)}
                      </button>
                    }
                  </>
                )}
              </div>
            </div>
          </>
        )}
      />
      {stores.length === 0 && (
        <FormItem
          validateStatus={formService.getValidationStatus<ShowingOrder>(
            model.errors,
            nameof(model.stores),
          )}
          help={model.errors?.stores}
          className="indirect-sales-order-content"
        ></FormItem>
      )}

      <StoreModal
        isOpen={isOpen}
        onClose={handleCloseStoreModal}
        onSave={handleSaveStore}
        isSave={true}
        pagination={pagination}
        getList={showingOrderRepository.listStore}
        count={showingOrderRepository.countStore}
        loadList={loadList}
        setLoadList={setLoadList}
        setSelectedList={setSelectedList}
        selectedList={selectedList}
        modelFilterClass={StoreFilter}
        filter={filterStore}
        setFilter={setFilterStore}
      />
      {
        <input
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          ref={inputRef}
        />
      }

      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </>
  );
}
export default ShowingListStoreTable;
